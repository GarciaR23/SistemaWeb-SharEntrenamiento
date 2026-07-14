package edu.utp.backend.features.instructor.revision.dtos;

import java.time.LocalDateTime;

public record RecienteSemanalDto(
                Integer idDetalle,
                String nombrePaciente,
                String clasificacion,
                LocalDateTime fechaCreacion) {
}