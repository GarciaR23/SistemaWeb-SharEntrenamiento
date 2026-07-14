package edu.utp.backend.features.instructor.analitica.dtos;

import java.math.BigDecimal;

public record SesionesFinalizadasDto(
        Long totalSesionesActual,
        BigDecimal porcentajeVariacion) {
}