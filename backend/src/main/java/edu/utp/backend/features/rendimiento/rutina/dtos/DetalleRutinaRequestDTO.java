package edu.utp.backend.features.rendimiento.rutina.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DetalleRutinaRequestDTO(
        @NotNull Integer idRuta,
        @NotBlank String nombreEjercicio,
        @NotBlank String tipoEjercicio,
        String descripcionEjercicio,
        @NotBlank String duracionEstimada 
) {
}