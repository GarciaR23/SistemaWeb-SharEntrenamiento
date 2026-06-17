package edu.utp.backend.features.usuario.dtos;

import java.time.ZonedDateTime;

import edu.utp.backend.features.usuario.enums.EstadoCuenta;
import edu.utp.backend.features.usuario.enums.Rol;

public record UsuarioResponse(
        Long idUsuario,
        String email,
        Rol rol,
        EstadoCuenta estadoCuenta,
        ZonedDateTime fechaRegistro) {
}