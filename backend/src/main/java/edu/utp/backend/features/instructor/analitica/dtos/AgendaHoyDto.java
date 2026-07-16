package edu.utp.backend.features.instructor.analitica.dtos;

import java.time.LocalTime;

public record AgendaHoyDto(
        Integer idSesion,
        LocalTime horaInicio,
        LocalTime horaFin,
        String nombreCompleto,
        String fotoPaciente,
        String sede,
        String distrito) {
}