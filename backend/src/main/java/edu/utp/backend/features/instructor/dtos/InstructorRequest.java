package edu.utp.backend.features.instructor.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record InstructorRequest(
        @NotNull Long idUsuario,
        @NotBlank String nombreCompleto,
        String urlImagenPerfil,
        String especialidad,
        String biografia,
        @NotBlank String distrito,
        @NotBlank String direccion) {
}