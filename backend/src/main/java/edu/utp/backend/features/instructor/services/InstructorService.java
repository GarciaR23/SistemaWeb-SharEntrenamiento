package edu.utp.backend.features.instructor.services;

import java.math.BigDecimal;
import java.util.List;

import edu.utp.backend.features.instructor.dtos.InstructorBusquedaResponse;
import edu.utp.backend.features.instructor.dtos.InstructorPerfilCalificacionDto;
import edu.utp.backend.features.instructor.dtos.InstructorPerfilResumenDto;
import edu.utp.backend.features.instructor.dtos.InstructorPerfilSedeDto;
import edu.utp.backend.features.instructor.dtos.InstructorPerfilServicioDto;
import edu.utp.backend.features.instructor.dtos.InstructorRequest;
import edu.utp.backend.features.instructor.dtos.InstructorResponse;

public interface InstructorService {
    List<InstructorResponse> findAll();

    InstructorResponse findById(Integer id);

    InstructorResponse create(InstructorRequest request);

    InstructorResponse update(Integer id, InstructorRequest request);

    void delete(Integer id);

    List<InstructorBusquedaResponse> buscarInstructoresParaTutor(
            String texto,
            String distrito,
            String especialidad,
            BigDecimal tarifaMin,
            BigDecimal tarifaMax,
            String turno
    );

    InstructorPerfilResumenDto obtenerPerfilResumen(Integer idInstructor);

    List<InstructorPerfilSedeDto> obtenerPerfilSedes(Integer idInstructor);

    List<InstructorPerfilServicioDto> obtenerPerfilServicios(Integer idInstructor);

    List<InstructorPerfilCalificacionDto> obtenerPerfilCalificaciones(Integer idInstructor);
}