package edu.utp.backend.features.instructor.dtos;

public record InstructorResponse(
        Integer idInstructor,
        Long idUsuario,
        String nombreCompleto,
        String urlImagenPerfil,
        String especialidad,
        String biografia,
        String distrito,
        String direccion) {
}