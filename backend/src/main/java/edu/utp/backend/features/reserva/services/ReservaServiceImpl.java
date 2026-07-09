package edu.utp.backend.features.reserva.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.utp.backend.core.exception.HorarioOcupadoException;
import edu.utp.backend.features.reserva.dtos.DetalleReservaDto;
import edu.utp.backend.features.reserva.dtos.ReservaDto;
import edu.utp.backend.features.reserva.dtos.ReservaRequestDto;
import edu.utp.backend.features.reserva.dtos.ReservaTutorSesionDto;
import edu.utp.backend.features.reserva.entities.DetalleReserva;
import edu.utp.backend.features.reserva.entities.Reserva;
import edu.utp.backend.features.reserva.projections.ReservaTutorSesionProjection;
import edu.utp.backend.features.reserva.repositories.DetalleReservaRepository;
import edu.utp.backend.features.reserva.repositories.ReservaRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReservaServiceImpl implements ReservaService {

    private final ReservaRepository reservaRepository;
    private final DetalleReservaRepository detalleReservaRepository;

    @Override
    public List<ReservaDto> findAll() {
        return reservaRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    public List<ReservaDto> findByPaciente(Integer idPaciente) {
        return reservaRepository.findByIdPacienteOrderByFechaCreacionDesc(idPaciente)
                .stream().map(this::toDto).toList();
    }

    @Override
    public List<ReservaDto> findByInstructor(Integer idInstructor) {
        return reservaRepository.findByIdInstructorOrderByFechaCreacionDesc(idInstructor)
                .stream().map(this::toDto).toList();
    }

    @Override
    public ReservaDto findById(Integer id) {
        return reservaRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Reserva no encontrada: " + id));
    }

    // Validar disponibilidad sin guardar
    @Override
    public void validarDisponibilidad(ReservaRequestDto request) {
        validarReserva(request);

        for (var detalle : request.detalles()) {
            LocalDateTime horaInicio = detalle.horaInicioEstimada();
            LocalDateTime horaFin = horaInicio.plusMinutes(detalle.duracionMinutos());

            boolean existeCruce = detalleReservaRepository.existeCruceInstructor(
                    request.idInstructor(), horaInicio, horaFin);
            if (existeCruce) {
                throw new HorarioOcupadoException(
                        "El instructor ya tiene una reserva en el horario: " +
                                horaInicio.toLocalDate() + " de " +
                                horaInicio.toLocalTime() + " a " +
                                horaFin.toLocalTime() +
                                ". Por favor elige otro horario.");
            }
        }
    }

    @Override
    @Transactional
    public ReservaDto create(ReservaRequestDto request) {
        validarReserva(request);

        // Validar cruce para cada detalle
        for (var detalle : request.detalles()) {
            LocalDateTime horaInicio = detalle.horaInicioEstimada();
            LocalDateTime horaFin = horaInicio.plusMinutes(detalle.duracionMinutos());

            boolean existeCruce = detalleReservaRepository.existeCruceInstructor(
                    request.idInstructor(), horaInicio, horaFin);
            if (existeCruce) {
                throw new HorarioOcupadoException(
                        "El instructor ya tiene una reserva en el horario: " +
                                horaInicio.toLocalDate() + " de " +
                                horaInicio.toLocalTime() + " a " +
                                horaFin.toLocalTime() +
                                ". Por favor elige otro horario.");
            }
        }

        // Calcular totales
        long totalMinutos = request.detalles().stream()
                .mapToLong(d -> d.duracionMinutos()).sum();
        BigDecimal montoTotal = request.detalles().stream()
                .map(d -> d.montoSubtotal())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Crear reserva
        Reserva reserva = new Reserva();
        reserva.setIdPaciente(request.idPaciente());
        reserva.setIdInstructor(request.idInstructor());
        reserva.setIdSede(request.idSede());

        long horas = totalMinutos / 60;
        long minutos = totalMinutos % 60;
        reserva.setTotalHorasAcumuladas(horas + " hours " + minutos + " minutes");

        reserva.setMontoTotalAcumulado(montoTotal);
        reserva.setEstadoReserva("pendiente");

        Reserva reservaGuardada = reservaRepository.save(reserva);

        // Crear detalles
        for (var detalle : request.detalles()) {
            LocalDateTime horaInicio = detalle.horaInicioEstimada();
            LocalDateTime horaFin = horaInicio.plusMinutes(detalle.duracionMinutos());

            DetalleReserva dr = new DetalleReserva();
            dr.setIdReserva(reservaGuardada.getIdReserva());
            dr.setHoraInicioEstimada(horaInicio);
            dr.setHoraFinEstimada(horaFin);

            long detalleHoras = detalle.duracionMinutos() / 60;
            long detalleMinutos = detalle.duracionMinutos() % 60;
            dr.setDuracionEntrenamiento(detalleHoras + " hours " + detalleMinutos + " minutes");

            dr.setMontoSubtotal(detalle.montoSubtotal());
            detalleReservaRepository.save(dr);
        }

        return toDto(reservaGuardada);
    }

    @Override
    @Transactional
    public void cancelar(Integer id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reserva no encontrada: " + id));
        reserva.setEstadoReserva("cancelada");
        reservaRepository.save(reserva);
    }

    private void validarReserva(ReservaRequestDto request) {
        if (request.idPaciente() == null)
            throw new IllegalArgumentException("El paciente es obligatorio.");
        if (request.idInstructor() == null)
            throw new IllegalArgumentException("El instructor es obligatorio.");
        if (request.idSede() == null)
            throw new IllegalArgumentException("La sede es obligatoria.");
        if (request.detalles() == null || request.detalles().isEmpty())
            throw new IllegalArgumentException("Debe incluir al menos un detalle de reserva.");

        for (var d : request.detalles()) {
            if (d.horaInicioEstimada() == null)
                throw new IllegalArgumentException("La hora de inicio es obligatoria.");
            if (d.horaInicioEstimada().isBefore(LocalDateTime.now()))
                throw new IllegalArgumentException("No se puede reservar en una fecha pasada.");
            if (d.duracionMinutos() == null || d.duracionMinutos() < 30)
                throw new IllegalArgumentException("La duración mínima debe ser de 30 minutos.");
            if (d.montoSubtotal() == null)
                throw new IllegalArgumentException("El monto subtotal es obligatorio.");
        }
    }

    @Override
    public List<ReservaTutorSesionDto> findSesionesByTutor(Integer idTutor) {
        return reservaRepository.findSesionesByTutor(idTutor)
                .stream().map(this::toReservaTutorSesionDto).toList();
    }

    private ReservaDto toDto(Reserva reserva) {
        List<DetalleReservaDto> detalles = detalleReservaRepository.findByIdReserva(reserva.getIdReserva())
                .stream()
                .map(d -> new DetalleReservaDto(d.getIdDetalle(), d.getHoraInicioEstimada(),
                        d.getHoraFinEstimada(), d.getDuracionEntrenamiento(), d.getMontoSubtotal()))
                .toList();

        return new ReservaDto(
                reserva.getIdReserva(), reserva.getIdPaciente(), reserva.getIdInstructor(),
                reserva.getIdSede(), reserva.getTotalHorasAcumuladas(), reserva.getMontoTotalAcumulado(),
                reserva.getEstadoReserva(), reserva.getFechaCreacion(), reserva.getFechaRevision(), detalles);
    }

    private ReservaTutorSesionDto toReservaTutorSesionDto(ReservaTutorSesionProjection r) {
        return new ReservaTutorSesionDto(
                r.getIdReserva(),
                r.getIdDetalle(), // ✅ NUEVO
                r.getIdPaciente(),
                r.getPacienteNombre(),
                r.getPacienteImagen(),
                r.getIdInstructor(),
                r.getInstructorNombre(),
                r.getInstructorImagen(),
                r.getEspecialidad(),
                r.getIdSede(),
                r.getNombreSede(),
                r.getDireccionSede(),
                r.getHoraInicioEstimada(),
                r.getHoraFinEstimada(),
                r.getDuracionMinutos(),
                r.getMontoSubtotal(), // ✅ CAMBIADO
                r.getEstadoReserva(),
                r.getEstadoSesion(),
                r.getFechaCreacion());
    }
}