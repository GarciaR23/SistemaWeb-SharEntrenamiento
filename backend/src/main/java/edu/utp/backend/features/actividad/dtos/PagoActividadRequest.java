package edu.utp.backend.features.actividad.dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record PagoActividadRequest(

        @NotBlank
        String metodoPago,

        @Min(1)
        @Max(5)
        Integer puntajeEstrellas,

        String comentarioTutor
) {
}