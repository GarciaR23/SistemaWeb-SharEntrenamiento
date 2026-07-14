package edu.utp.backend.features.rendimiento.rutina.dtos;

public record DetalleRutinaResponseDTO(
        Integer idDetalle,
        Integer idRuta,
        String nombreEjercicio,
        String tipoEjercicio,
        String descripcionEjercicio,
        String duracionEstimada) {
}