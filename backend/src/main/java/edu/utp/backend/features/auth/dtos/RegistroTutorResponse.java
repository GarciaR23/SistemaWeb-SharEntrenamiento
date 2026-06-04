package edu.utp.backend.features.auth.dtos;

public record RegistroTutorResponse(
        boolean success,
        String message,
        String token,
        UsuarioResponse usuario,
        int idTutor) {
}