package edu.utp.backend.features.instructor.dtos;

import java.math.BigDecimal;
import java.time.LocalTime;

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
        String horarioPreferencia,
        String diaDisponible,
        LocalTime horarioInicio,
        LocalTime horarioFinal,

        BigDecimal promedioCalificacion,
        Long totalSesiones
    ) {
}