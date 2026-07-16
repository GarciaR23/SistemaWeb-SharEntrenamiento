package edu.utp.backend.features.instructor.dtos;

import java.time.LocalDateTime;

public record InstructorPerfilCalificacionDto(
        Integer idCalificacion,
        Integer idPaciente,
        String pacienteNombre,
        Integer puntajeEstrellas,
        String comentarioCliente,
        LocalDateTime fechaCalificacion
) {
}