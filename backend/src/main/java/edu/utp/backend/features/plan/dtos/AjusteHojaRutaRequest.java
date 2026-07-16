package edu.utp.backend.features.plan.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AjusteHojaRutaRequest(

        @NotNull
        Integer idEjercicioOriginal,

        @NotBlank
        String motivoCambio,

        @NotBlank
        @Size(min = 10, max = 700)
        String motivoDetallado,

        @NotBlank
        @Size(min = 5, max = 700)
        String ejercicioModificado
) {
}