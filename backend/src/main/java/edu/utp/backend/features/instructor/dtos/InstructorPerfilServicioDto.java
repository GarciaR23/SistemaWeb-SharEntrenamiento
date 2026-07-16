package edu.utp.backend.features.instructor.dtos;

import java.math.BigDecimal;
import java.time.LocalTime;

public record InstructorPerfilServicioDto(
        Integer idServicio,
        BigDecimal tarifaHora,
        String horarioPreferencia,
        String diaSemana,
        LocalTime horarioInicio,
        LocalTime horarioFinal
) {
}