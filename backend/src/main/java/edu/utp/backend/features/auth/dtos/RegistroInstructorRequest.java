package edu.utp.backend.features.auth.dtos;

import java.math.BigDecimal;
import java.util.List;

import edu.utp.backend.features.instructor.dtos.InstructorPerfilServicioDto;
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
        List<InstructorPerfilServicioDto> horarios) {
}