package edu.utp.backend.features.tutor.progreso_paciente.dtos;

import java.math.BigDecimal;

public record ProgresoKpiDto(
        BigDecimal promedioCoordinacion,
        BigDecimal promedioEquilibrio,
        BigDecimal promedioResistencia,
        Long totalReportesEvaluados,
        BigDecimal tendenciaCoordinacion,
        BigDecimal tendenciaEquilibrio,
        BigDecimal tendenciaResistencia) {
}