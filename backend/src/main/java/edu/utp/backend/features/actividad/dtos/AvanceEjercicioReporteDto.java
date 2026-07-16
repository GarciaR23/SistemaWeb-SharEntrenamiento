package edu.utp.backend.features.actividad.dtos;

public record AvanceEjercicioReporteDto(
        Integer idDetalleRutina,
        String nombreEjercicio,
        String tipoEjercicio,
        String descripcionEjercicio,
        String estadoEjercicio
) {
}