package edu.utp.backend.features.actividad.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record IncidenciaActividadRequest(

                @NotNull Integer idPaciente,

                @NotNull Integer idInstructor,

                @NotBlank String motivoIncidencia,

                @NotBlank String nivelGravedad,

                @NotBlank @Size(min = 10, max = 500) String descripcionIncidencia,

                String urlEvidencia1,
                String urlEvidencia2,
                String urlEvidencia3) {
}