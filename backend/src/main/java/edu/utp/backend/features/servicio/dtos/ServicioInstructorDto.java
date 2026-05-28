package edu.utp.backend.features.servicio.dtos;

import java.math.BigDecimal;
import java.time.LocalTime;

public record ServicioInstructorDto(
        Integer idServicio,
        Integer idInstructor,
        BigDecimal tarifaHora,
        String horarioPreferencia,
        String diaDisponible,
        LocalTime horarioInicio,
        LocalTime horarioFinal) {
}