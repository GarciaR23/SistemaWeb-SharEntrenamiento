package edu.utp.backend.features.sede.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SedeRequest(
    @NotNull Integer idInstructor,
    @NotBlank String urlImagenSede1,
    String urlImagenSede2,
    String urlImagenSede3,
    String descripcionSede,
    @NotBlank String direccionSede,
    @NotBlank String distritoSede,
    Boolean estadoActivacion
) {

}
