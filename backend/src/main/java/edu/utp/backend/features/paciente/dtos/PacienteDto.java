package edu.utp.backend.features.paciente.dtos;

public record PacienteDto(
        Integer idPaciente,
        Integer idTutor,
        String nombreCompleto,
        String urlImagenPaciente,
        String condicion,
        String gradoAutismo,
        String genero,
        Integer edad,
        String distrito,
        String direccion) {
}