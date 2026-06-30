package edu.utp.backend.features.instructor.dtos;

public record InstructorPerfilResumenDto(
        Integer idInstructor,
        String nombreCompleto,
        String urlImagenPerfil,
        String especialidad,
        String biografia,
        String direccion,
        String distrito
) {
}