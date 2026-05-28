package edu.utp.backend.features.auth.dtos;

import java.time.ZonedDateTime;

import edu.utp.backend.features.auth.usuario.enums.EstadoCuenta;
import edu.utp.backend.features.auth.usuario.enums.Rol;

public record UsuarioResponse(
        Long idUsuario,
        String email,
        Rol rol,
        EstadoCuenta estadoCuenta,
        ZonedDateTime fechaRegistro) {
}