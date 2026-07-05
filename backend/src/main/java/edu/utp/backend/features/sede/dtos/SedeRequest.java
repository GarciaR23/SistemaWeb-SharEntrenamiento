package edu.utp.backend.features.sede.dtos;

import edu.utp.backend.features.sede.enums.ZonaSedeEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SedeRequest(
    @NotNull Integer idInstructor,
    @NotNull ZonaSedeEnum zonaSede,
    @NotBlank String nombreSede,
    @NotBlank String urlImagenSede1,
    String urlImagenSede2,
    String urlImagenSede3,
    String descripcionSede,
    @NotBlank String direccionSede,
    @NotBlank String distritoSede,
    Boolean estadoActivacion
) {

}