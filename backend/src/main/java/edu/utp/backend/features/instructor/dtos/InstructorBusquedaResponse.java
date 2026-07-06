package edu.utp.backend.features.instructor.dtos;

import java.math.BigDecimal;
import java.util.List;

public record InstructorBusquedaResponse(
        Integer idInstructor,
        String nombreCompleto,
        String urlImagenPerfil,
        String especialidad,
        String biografia,
        String distrito,
        String direccion,

        Integer idSede,
        String direccionSede,
        String distritoSede,

        BigDecimal tarifaHora,
        
        List<InstructorPerfilServicioDto> horarios,

        BigDecimal promedioCalificacion,
        Long totalSesiones
    ) {
}