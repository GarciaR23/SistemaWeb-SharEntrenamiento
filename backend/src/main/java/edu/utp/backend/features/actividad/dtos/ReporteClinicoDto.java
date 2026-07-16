package edu.utp.backend.features.actividad.dtos;

import java.time.LocalDateTime;
import java.time.LocalTime;

public record ReporteClinicoDto(
        Integer idReporte,
        Integer idReserva,
        Integer idPaciente,
        LocalTime horaInicioReal,
        LocalTime horaFinalReal,
        String respuestaAuditiva,
        String respuestaVisual,
        Integer compromisoSesion,
        Integer puntajeCoordinacion,
        Integer puntajeEquilibrio,
        Integer puntajeResistencia,
        String observacionTecnica,
        String recommendaciones,
        LocalDateTime fechaRegistro
) {
}