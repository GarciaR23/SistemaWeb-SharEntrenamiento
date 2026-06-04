package edu.utp.backend.features.auth.dtos;

public record RegistroInstructorResponse(
        boolean success,
        String message,
        UsuarioResponse usuario,
        int idInstructor) {
}