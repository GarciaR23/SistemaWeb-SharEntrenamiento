package edu.utp.backend.features.instructor.revision.dtos;

import java.time.LocalDate;
import java.time.LocalTime;

public record RevisionPacienteDto(
                Integer idDetalle,
                Integer idReserva,
                String nombrePaciente,
                String urlImagenPaciente,
                Integer edad,
                LocalDate fechaReserva,
                LocalTime horaInicio,
                String duracionEntrenamiento,
                String zonaSede) {
}