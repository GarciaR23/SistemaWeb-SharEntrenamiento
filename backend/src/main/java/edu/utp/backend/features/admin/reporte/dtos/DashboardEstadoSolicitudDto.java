package edu.utp.backend.features.admin.reporte.dtos;

import java.util.List;

public record DashboardEstadoSolicitudDto(
        List<EstadoSolicitudDto> estados,
        Long totalSolicitudes) {
}