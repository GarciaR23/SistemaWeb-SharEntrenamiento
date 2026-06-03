package edu.utp.backend.features.auth.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegistroInstructorRequest(
        @NotBlank @Email String email,
        @NotBlank String clave,
        @NotBlank String nombreCompleto,
        String urlImagenPerfil,
        String especialidad,
        String biografia,
        @NotBlank String distrito,
        @NotBlank String direccion) {
}