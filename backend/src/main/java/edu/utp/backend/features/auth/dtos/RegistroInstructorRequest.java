package edu.utp.backend.features.auth.dtos;

import java.math.BigDecimal;
import java.time.LocalTime;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegistroInstructorRequest(
        @NotBlank @Email String email,
        @NotBlank String clave,
        @NotBlank String nombreCompleto,
        String urlImagenPerfil,
        String especialidad,
        String biografia,
        @NotBlank String distrito,
        @NotBlank String direccion,

        @NotNull BigDecimal tarifaHora,
        @NotBlank String horarioPreferencia,
        @NotBlank String diaDisponible,
        LocalTime horarioInicio,
        LocalTime horarioFinal) {
}