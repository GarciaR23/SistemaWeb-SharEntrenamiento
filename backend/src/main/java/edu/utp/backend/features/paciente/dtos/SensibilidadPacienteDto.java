package edu.utp.backend.features.paciente.dtos;

public record SensibilidadPacienteDto(
        Integer idSensibilidad,
        Integer idPaciente,
        String tipoSensibilidad) {
}