package edu.utp.backend.features.admin.reporte.dtos;

public record PacienteControlDto(
        Long totalPacientes,
        Long pacientesActivos,
        Long pacientesInactivos60Dias,
        Long totalActivosActual,
        Double porcentajeVariacion) {
}