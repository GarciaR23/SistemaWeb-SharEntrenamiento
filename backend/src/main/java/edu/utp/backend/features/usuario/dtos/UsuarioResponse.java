package edu.utp.backend.features.usuario.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.ZonedDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record UsuarioResponse(
                Long idUsuario,
                String email,
                String rol,
                String estadoCuenta,
                ZonedDateTime fechaRegistro,
                Long idInstructor,
                Long idTutor,
                Long idPaciente,
                Long idAdmin) {
}