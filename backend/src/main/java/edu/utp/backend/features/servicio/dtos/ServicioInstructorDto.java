package edu.utp.backend.features.servicio.dtos;

import java.math.BigDecimal;

public record ServicioInstructorDto(
        Integer idServicio,
        Integer idInstructor,
        BigDecimal tarifaHora) {
}