package edu.utp.backend.features.auth.dtos;

public record LoginResponse(
        boolean success,
        String message,
        String token,
        UsuarioResponse usuario) {
}