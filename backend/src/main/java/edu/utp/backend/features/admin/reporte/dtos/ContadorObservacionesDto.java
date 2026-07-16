package edu.utp.backend.features.admin.reporte.dtos;

public record ContadorObservacionesDto(
        Long totalCasos,
        Long enMediacion,
        Long rechazados) {
}