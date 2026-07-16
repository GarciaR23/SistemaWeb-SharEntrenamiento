package edu.utp.backend.features.actividad.services;

import edu.utp.backend.features.actividad.dtos.*;
import edu.utp.backend.features.actividad.repositories.ActividadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActividadServiceImpl implements ActividadService {

        private static final String PIN_VALIDO = "1234";

        private final ActividadRepository actividadRepository;

        @Override
        public List<ActividadTutorDto> listarPorTutor(Integer idTutor) {
                return actividadRepository.listarPorTutor(idTutor);
        }

        @Override
        @Transactional
        public ActividadTutorDto iniciarActividad(Integer idDetalle, String pin) {
                ActividadTutorDto actividad = actividadRepository.obtenerPorDetalle(idDetalle);

                if (!Boolean.TRUE.equals(actividad.hojaRutaAceptada())) {
                        throw new IllegalStateException(
                                        "La hoja de ruta todavía no fue aceptada por el tutor.");
                }

                if (!PIN_VALIDO.equals(pin)) {
                        throw new IllegalArgumentException("El PIN ingresado es incorrecto.");
                }

                LocalDateTime ahora = LocalDateTime.now();
                LocalDateTime inicio = actividad.horaInicioEstimada();
                LocalDateTime limiteTolerancia = inicio.plusMinutes(10);

                if (ahora.isBefore(inicio)) {
                        throw new IllegalStateException(
                                        "La asistencia solo puede marcarse desde la hora programada.");
                }

                if (ahora.isAfter(limiteTolerancia)) {
                        throw new IllegalStateException(
                                        "La tolerancia de 10 minutos para registrar asistencia ha vencido.");
                }

                if (actividadRepository.existeSesionPorDetalle(idDetalle)) {
                        actividadRepository.actualizarSesionEnCurso(idDetalle);
                } else {
                        actividadRepository.crearSesionEnCurso(
                                        actividad.idReserva(),
                                        actividad.idDetalle());
                }

                ActividadTutorDto actualizada = actividadRepository.obtenerPorDetalle(idDetalle);

                if (actualizada.idSesion() != null) {
                        actividadRepository.registrarAsistenciaPin(
                                        actualizada.idSesion(),
                                        pin);
                }

                return actividadRepository.obtenerPorDetalle(idDetalle);
        }

        @Override
        @Transactional
        public ActividadTutorDto registrarIncidencia(Integer idSesion, IncidenciaActividadRequest request) {
                String motivo = normalizarMotivo(request.motivoIncidencia());
                String gravedad = normalizarGravedad(request.nivelGravedad());

                String accionSugerida = motivo.equals("colapso_paciente")
                                ? "suspender"
                                : "mediacion";

                Integer idIncidencia = actividadRepository.registrarIncidencia(
                                idSesion,
                                request.idPaciente(),
                                request.idInstructor(),
                                motivo,
                                request.descripcionIncidencia());

                actividadRepository.registrarDetalleIncidencia(
                                idIncidencia,
                                gravedad,
                                request.urlEvidencia1(),
                                request.urlEvidencia2(),
                                request.urlEvidencia3(),
                                accionSugerida);

                if (motivo.equals("colapso_paciente")) {
                        actividadRepository.finalizarSesion(idSesion);
                        return actividadRepository.obtenerPorSesion(idSesion);
                }

                ActividadTutorDto actividad = actividadRepository.obtenerPorSesion(idSesion);

                actividadRepository.marcarSesionReprogramada(idSesion);

                if (!actividadRepository.existeReprogramacionPendiente(idSesion)) {
                        Integer idReprogramar = actividadRepository.crearReprogramacion(
                                        idSesion,
                                        request.descripcionIncidencia());

                        actividadRepository.crearPropuestasReprogramacion(
                                        idReprogramar,
                                        actividad.horaInicioEstimada());
                }

                return actividadRepository.obtenerPorSesion(idSesion);
        }

        @Override
        @Transactional
        public ActividadTutorDto confirmarPago(Integer idDetalle, PagoActividadRequest request) {
                ActividadTutorDto actividad = actividadRepository.obtenerPorDetalle(idDetalle);

                if (actividad.idSesion() == null) {
                        throw new IllegalStateException("No existe una sesión asociada para registrar el pago.");
                }

                if (actividadRepository.existePago(actividad.idReserva())) {
                        actividadRepository.actualizarPagoRecibido(actividad.idReserva());
                } else {
                        actividadRepository.registrarPago(
                                        actividad.idReserva(),
                                        actividad.idPaciente(),
                                        actividad.idInstructor(),
                                        actividad.montoSubtotal());
                }

                if (request.puntajeEstrellas() != null) {
                        if (actividadRepository.existeCalificacionPorSesion(actividad.idSesion())) {
                                actividadRepository.actualizarCalificacionServicio(
                                                actividad.idSesion(),
                                                request.puntajeEstrellas(),
                                                request.comentarioTutor());
                        } else {
                                actividadRepository.registrarCalificacionServicio(
                                                actividad.idPaciente(),
                                                actividad.idInstructor(),
                                                actividad.idSesion(),
                                                request.puntajeEstrellas(),
                                                request.comentarioTutor());
                        }
                }

                actividadRepository.finalizarSesion(actividad.idSesion());

                return actividadRepository.obtenerPorDetalle(idDetalle);
        }

        @Override
        @Transactional
        public ActividadTutorDto aceptarReprogramacion(
                        Integer idDetalle,
                        AceptarReprogramacionRequest request) {
                ActividadTutorDto actividad = actividadRepository.obtenerPorDetalle(idDetalle);

                if (actividad.idSesion() == null) {
                        throw new IllegalStateException(
                                        "No existe sesión asociada a la reprogramación.");
                }

                PropuestaReprogramacionDto propuesta = actividadRepository.obtenerPropuesta(
                                request.idDetalleReprogramar());

                LocalDateTime nuevoInicio = LocalDateTime.of(
                                propuesta.fechaPropuesta(),
                                propuesta.horaInicioPropuesta());

                LocalDateTime nuevoFin = LocalDateTime.of(
                                propuesta.fechaPropuesta(),
                                propuesta.horaFinPropuesta());

                actividadRepository.aceptarReprogramacion(
                                propuesta.idReprogramar(),
                                propuesta.idDetalleReprogramar());

                actividadRepository.actualizarHorarioDetalle(
                                idDetalle,
                                nuevoInicio,
                                nuevoFin);

                actividadRepository.ponerSesionPendiente(
                                actividad.idSesion());

                return actividadRepository.obtenerPorDetalle(idDetalle);
        }

        @Override
        public ReporteTecnicoDto obtenerReportePorReserva(Integer idReserva) {
                return actividadRepository
                                .obtenerReportePorReserva(idReserva)
                                .orElseThrow(() -> new IllegalStateException(
                                                "El instructor aún no ha registrado el reporte técnico de esta sesión."));
        }

        private String normalizarMotivo(String motivo) {
                String value = motivo == null ? "" : motivo.trim().toLowerCase();

                return switch (value) {
                        case "impuntualidad" -> "impuntualidad";
                        case "maltrato", "mal_trato" -> "mal_trato";
                        case "incidente_menor", "incidente menor" -> "incidente_menor";
                        case "colapso", "colapso_paciente" -> "colapso_paciente";
                        default -> throw new IllegalArgumentException(
                                        "Motivo de incidencia no válido.");
                };
        }

        private String normalizarGravedad(String gravedad) {
                String value = gravedad == null ? "" : gravedad.trim().toLowerCase();

                return switch (value) {
                        case "baja" -> "baja";
                        case "moderada" -> "moderada";
                        case "critica", "crítica" -> "critica";
                        default -> throw new IllegalArgumentException(
                                        "Nivel de gravedad no válido.");
                };
        }
}