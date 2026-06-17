package edu.utp.backend.features.usuario.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UsuarioRequest(
        @NotBlank @Email String email,
        @NotBlank String clave,
        @NotBlank String rol,
        @NotBlank String estadoCuenta) {
}