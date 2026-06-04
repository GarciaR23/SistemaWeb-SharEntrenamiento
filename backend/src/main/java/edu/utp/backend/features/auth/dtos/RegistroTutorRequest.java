package edu.utp.backend.features.auth.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegistroTutorRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres") String clave,
        @NotBlank String nombreCompleto) {
}