package edu.utp.backend.features.admin.reporte.dtos;

import java.util.List;

public record DashboardInstructoresDto(
        List<CrecimientoInstructorDto> crecimiento,
        Double porcentajeMensual) {
}