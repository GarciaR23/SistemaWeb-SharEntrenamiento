package edu.utp.backend.features.instructor.revision.dtos;

import java.time.LocalDateTime;

public record RecienteSemanalDto(
        Integer idReserva,
        String nombrePaciente,
        String clasificacion,
        LocalDateTime fechaCreacion) {
}