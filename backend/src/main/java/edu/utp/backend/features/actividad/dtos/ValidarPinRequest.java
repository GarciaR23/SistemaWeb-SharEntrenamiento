package edu.utp.backend.features.actividad.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ValidarPinRequest(

        @NotBlank(message = "El PIN es obligatorio") @Pattern(regexp = "\\d{4}", message = "El PIN debe tener 4 dígitos") String pin) {
}