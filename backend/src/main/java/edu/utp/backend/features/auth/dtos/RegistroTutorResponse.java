package edu.utp.backend.features.auth.dtos;

import edu.utp.backend.features.usuario.dtos.UsuarioResponse;

public record RegistroTutorResponse(
        boolean success,
        String message,
        String token,
        UsuarioResponse usuario,
        int idTutor) {
}