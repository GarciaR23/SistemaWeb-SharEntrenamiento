package edu.utp.backend.features.plan.dtos;

public record DetalleRutinaPlanDto(
        Integer idDetalleRutina,
        String nombreEjercicio,
        String tipoEjercicio,
        String descripcionEjercicio,
        Integer duracionEstimada) {
}