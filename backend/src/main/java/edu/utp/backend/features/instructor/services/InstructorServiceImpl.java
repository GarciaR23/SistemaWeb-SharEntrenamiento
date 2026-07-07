package edu.utp.backend.features.instructor.services;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;
import static java.util.stream.Collectors.*;

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
import edu.utp.backend.features.instructor.projections.InstructorPerfilCalificacionProjection;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InstructorServiceImpl implements InstructorService {

    private final InstructorRepository instructorRepository;

    private static final Map<String, Integer> ORDEN_DIAS = Map.of(
            "L", 1, "M", 2, "Mi", 3, "J", 4, "V", 5, "S", 6, "D", 7);

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
            String texto, String distrito, String especialidad,
            BigDecimal tarifaMin, BigDecimal tarifaMax, String turno) {

        List<InstructorBusquedaProjection> proyecciones = instructorRepository.buscarInstructoresParaTutor(
                normalizarFiltro(texto), normalizarFiltro(distrito),
                normalizarFiltro(especialidad), tarifaMin, tarifaMax, normalizarFiltro(turno));

        return proyecciones.stream()
                .collect(groupingBy(InstructorBusquedaProjection::getIdInstructor))
                .values().stream()
                .map(this::toBusquedaResponse)
                .toList();
    }

    private String normalizarFiltro(String valor) {
        return (valor == null || valor.trim().isBlank()) ? null : valor.trim();
    }

    private String ordenarDias(String dias) {
        if (dias == null)
            return null;
        return Arrays.stream(dias.split(", "))
                .sorted((a, b) -> ORDEN_DIAS.getOrDefault(a, 8) - ORDEN_DIAS.getOrDefault(b, 8))
                .collect(Collectors.joining(", "));
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
        return new InstructorResponse(instructor.getIdInstructor(), instructor.getIdUsuario(),
                instructor.getNombreCompleto(), instructor.getUrlImagenPerfil(), instructor.getEspecialidad(),
                instructor.getBiografia(), instructor.getDistrito(), instructor.getDireccion());
    }

    private InstructorBusquedaResponse toBusquedaResponse(List<InstructorBusquedaProjection> filas) {
        InstructorBusquedaProjection p = filas.get(0);

        List<InstructorPerfilServicioDto> horarios = filas.stream()
                .filter(f -> f.getDiaSemana() != null)
                .map(f -> new InstructorPerfilServicioDto(null, null, f.getHorarioPreferencia(),
                        ordenarDias(f.getDiaSemana()), f.getHorarioInicio(), f.getHorarioFinal()))
                .distinct().toList();

        return new InstructorBusquedaResponse(p.getIdInstructor(), p.getNombreCompleto(), p.getUrlImagenPerfil(),
                p.getEspecialidad(), p.getBiografia(), p.getDistrito(), p.getDireccion(),
                p.getIdSede(), p.getDireccionSede(), p.getDistritoSede(), p.getTarifaHora(),
                horarios, p.getPromedioCalificacion(), p.getTotalSesiones());
    }

    @Override
    public InstructorPerfilResumenDto obtenerPerfilResumen(Integer idInstructor) {
        InstructorPerfilResumenProjection p = instructorRepository.obtenerPerfilResumen(idInstructor);
        if (p == null)
            throw new IllegalArgumentException("Instructor no encontrado: " + idInstructor);
        return new InstructorPerfilResumenDto(p.getIdInstructor(), p.getNombreCompleto(), p.getUrlImagenPerfil(),
                p.getEspecialidad(), p.getBiografia(), p.getDireccion(), p.getDistrito());
    }

    @Override
    public List<InstructorPerfilSedeDto> obtenerPerfilSedes(Integer idInstructor) {
        return instructorRepository.obtenerPerfilSedes(idInstructor).stream().map(this::toPerfilSedeDto).toList();
    }

    @Override
    public List<InstructorPerfilServicioDto> obtenerPerfilServicios(Integer idInstructor) {
        return instructorRepository.obtenerPerfilServicios(idInstructor).stream()
                .map(s -> new InstructorPerfilServicioDto(s.getIdServicio(), s.getTarifaHora(),
                        s.getHorarioPreferencia(), ordenarDias(s.getDiaSemana()),
                        s.getHorarioInicio(), s.getHorarioFinal()))
                .toList();
    }

    @Override
    public List<InstructorPerfilCalificacionDto> obtenerPerfilCalificaciones(Integer idInstructor) {
        return instructorRepository.obtenerPerfilCalificaciones(idInstructor).stream()
                .map(this::toPerfilCalificacionDto).toList();
    }

    private InstructorPerfilSedeDto toPerfilSedeDto(InstructorPerfilSedeProjection s) {
        return new InstructorPerfilSedeDto(
                s.getIdSede(),
                s.getUrlImagenSede1(),
                s.getUrlImagenSede2(),
                s.getUrlImagenSede3(),
                s.getNombreSede(),
                s.getDescripcionSede(),
                s.getDireccionSede(),
                s.getDistritoSede(),
                s.getZonaSede(),
                s.getEstadoActivacion());
    }

    private InstructorPerfilCalificacionDto toPerfilCalificacionDto(InstructorPerfilCalificacionProjection c) {
        return new InstructorPerfilCalificacionDto(
                c.getIdCalificacion(),
                c.getIdPaciente(),
                c.getPacienteNombre(),
                c.getPuntajeEstrellas(),
                c.getComentarioTutor(),
                c.getFechaCalificacion());
    }
}