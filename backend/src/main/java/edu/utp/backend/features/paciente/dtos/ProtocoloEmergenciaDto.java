package edu.utp.backend.features.paciente.dtos;

public record ProtocoloEmergenciaDto(
        Integer idProtocolo,
        Integer idPaciente,
        String descripcion
) {
}