package edu.utp.backend.features.auth.dtos;

import edu.utp.backend.features.usuario.dtos.UsuarioResponse;

public record RegistroInstructorResponse(
        boolean success,
        String message,
        UsuarioResponse usuario,
        int idInstructor) {
}