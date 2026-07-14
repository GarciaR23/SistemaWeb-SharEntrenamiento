package edu.utp.backend.features.instructor.analitica.dtos;

import java.math.BigDecimal;

public record CalificacionPromedioDto(
        BigDecimal promedioEstrellas,
        Long totalCalificaciones) {
}