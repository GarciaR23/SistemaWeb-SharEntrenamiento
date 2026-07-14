package edu.utp.backend.features.instructor.analitica.dtos;

import java.math.BigDecimal;

public record PacientesActivosDto(
        Long totalActivosActual,
        BigDecimal porcentajeVariacion) {
}