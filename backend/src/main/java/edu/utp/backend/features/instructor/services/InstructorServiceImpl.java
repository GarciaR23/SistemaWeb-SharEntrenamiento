package edu.utp.backend.features.instructor.services;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.utp.backend.features.instructor.dtos.InstructorBusquedaResponse;
import edu.utp.backend.features.instructor.dtos.InstructorRequest;
import edu.utp.backend.features.instructor.dtos.InstructorResponse;
import edu.utp.backend.features.instructor.entities.Instructor;
import edu.utp.backend.features.instructor.repositories.InstructorBusquedaProjection;
import edu.utp.backend.features.instructor.repositories.InstructorRepository;
import edu.utp.backend.features.instructor.dtos.InstructorPerfilResumenDto;
import edu.utp.backend.features.instructor.dtos.InstructorPerfilSedeDto;
import edu.utp.backend.features.instructor.dtos.InstructorPerfilServicioDto;
import edu.utp.backend.features.instructor.dtos.InstructorPerfilCalificacionDto;

import edu.utp.backend.features.instructor.projections.InstructorPerfilResumenProjection;
import edu.utp.backend.features.instructor.projections.InstructorPerfilSedeProjection;
import edu.utp.backend.features.instructor.projections.InstructorPerfilServicioProjection;
import edu.utp.backend.features.instructor.projections.InstructorPerfilCalificacionProjection;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InstructorServiceImpl implements InstructorService {

    private final InstructorRepository instructorRepository;

    @Override
    public List<InstructorResponse> findAll() {
        return instructorRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public InstructorResponse findById(Integer id) {
        return instructorRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Instructor no encontrado: " + id));
    }

    @Override
    @Transactional
    public InstructorResponse create(InstructorRequest request) {
        Instructor instructor = new Instructor();
        applyRequest(instructor, request);
        return toResponse(instructorRepository.save(instructor));
    }

    @Override
    @Transactional
    public InstructorResponse update(Integer id, InstructorRequest request) {
        Instructor instructor = instructorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Instructor no encontrado: " + id));
        applyRequest(instructor, request);
        return toResponse(instructorRepository.save(instructor));
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        instructorRepository.deleteById(id);
    }

    @Override
    public List<InstructorBusquedaResponse> buscarInstructoresParaTutor(
            String texto,
            String distrito,
            String especialidad,
            BigDecimal tarifaMin,
            BigDecimal tarifaMax,
            String turno) {
        String textoFiltro = normalizarFiltro(texto);
        String distritoFiltro = normalizarFiltro(distrito);
        String especialidadFiltro = normalizarFiltro(especialidad);
        String turnoFiltro = normalizarFiltro(turno);

        return instructorRepository.buscarInstructoresParaTutor(
                textoFiltro,
                distritoFiltro,
                especialidadFiltro,
                tarifaMin,
                tarifaMax,
                turnoFiltro)
                .stream()
                .map(this::toBusquedaResponse)
                .toList();
    }

    private String normalizarFiltro(String valor) {
        if (valor == null || valor.trim().isBlank()) {
            return null;
        }

        return valor.trim();
    }

    private void applyRequest(Instructor instructor, InstructorRequest request) {
        instructor.setIdUsuario(request.idUsuario());
        instructor.setNombreCompleto(request.nombreCompleto());
        instructor.setUrlImagenPerfil(request.urlImagenPerfil());
        instructor.setEspecialidad(request.especialidad());
        instructor.setBiografia(request.biografia());
        instructor.setDistrito(request.distrito());
        instructor.setDireccion(request.direccion());
    }

    private InstructorResponse toResponse(Instructor instructor) {
        return new InstructorResponse(
                instructor.getIdInstructor(),
                instructor.getIdUsuario(),
                instructor.getNombreCompleto(),
                instructor.getUrlImagenPerfil(),
                instructor.getEspecialidad(),
                instructor.getBiografia(),
                instructor.getDistrito(),
                instructor.getDireccion());
    }

    private InstructorBusquedaResponse toBusquedaResponse(InstructorBusquedaProjection instructor) {
        return new InstructorBusquedaResponse(
                instructor.getIdInstructor(),
                instructor.getNombreCompleto(),
                instructor.getUrlImagenPerfil(),
                instructor.getEspecialidad(),
                instructor.getBiografia(),
                instructor.getDistrito(),
                instructor.getDireccion(),

                instructor.getIdSede(),
                instructor.getDireccionSede(),
                instructor.getDistritoSede(),

                instructor.getTarifaHora(),
                instructor.getHorarioPreferencia(),
                instructor.getDiaDisponible(),
                instructor.getHorarioInicio(),
                instructor.getHorarioFinal(),

                instructor.getPromedioCalificacion(),
                instructor.getTotalSesiones());

    }

    @Override
    public InstructorPerfilResumenDto obtenerPerfilResumen(Integer idInstructor) {
        InstructorPerfilResumenProjection instructor = instructorRepository.obtenerPerfilResumen(idInstructor);

        if (instructor == null) {
            throw new IllegalArgumentException("Instructor no encontrado: " + idInstructor);
        }

        return new InstructorPerfilResumenDto(
                instructor.getIdInstructor(),
                instructor.getNombreCompleto(),
                instructor.getUrlImagenPerfil(),
                instructor.getEspecialidad(),
                instructor.getBiografia(),
                instructor.getDireccion(),
                instructor.getDistrito());
    }

    @Override
    public List<InstructorPerfilSedeDto> obtenerPerfilSedes(Integer idInstructor) {
        return instructorRepository.obtenerPerfilSedes(idInstructor)
                .stream()
                .map(this::toPerfilSedeDto)
                .toList();
    }

    @Override
    public List<InstructorPerfilServicioDto> obtenerPerfilServicios(Integer idInstructor) {
        return instructorRepository.obtenerPerfilServicios(idInstructor)
                .stream()
                .map(this::toPerfilServicioDto)
                .toList();
    }

    @Override
    public List<InstructorPerfilCalificacionDto> obtenerPerfilCalificaciones(Integer idInstructor) {
        return instructorRepository.obtenerPerfilCalificaciones(idInstructor)
                .stream()
                .map(this::toPerfilCalificacionDto)
                .toList();
    }

    private InstructorPerfilSedeDto toPerfilSedeDto(InstructorPerfilSedeProjection sede) {
        return new InstructorPerfilSedeDto(
                sede.getIdSede(),
                sede.getUrlImagenSede1(),
                sede.getUrlImagenSede2(),
                sede.getUrlImagenSede3(),
                sede.getDescripcionSede(),
                sede.getDireccionSede(),
                sede.getDistritoSede(),
                sede.getEstadoActivacion());
    }

    private InstructorPerfilServicioDto toPerfilServicioDto(InstructorPerfilServicioProjection servicio) {
        return new InstructorPerfilServicioDto(
                servicio.getIdServicio(),
                servicio.getTarifaHora(),
                servicio.getHorarioPreferencia(),
                servicio.getDiaDisponible(),
                servicio.getHorarioInicio(),
                servicio.getHorarioFinal());
    }

    private InstructorPerfilCalificacionDto toPerfilCalificacionDto(
            InstructorPerfilCalificacionProjection calificacion) {
        return new InstructorPerfilCalificacionDto(
                calificacion.getIdCalificacion(),
                calificacion.getIdPaciente(),
                calificacion.getPacienteNombre(),
                calificacion.getPuntajeEstrellas(),
                calificacion.getComentarioTutor(),
                calificacion.getFechaCalificacion());
    }
}