package edu.utp.backend.features.paciente.dtos;

public record ContactoEmergenciaDto(
        Integer idContacto,
        Integer idPaciente,
        String nombreContacto,
        String telefono,
        String relacion
) {
}