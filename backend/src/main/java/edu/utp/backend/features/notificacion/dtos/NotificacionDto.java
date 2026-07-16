package edu.utp.backend.features.notificacion.dtos;

import java.time.LocalDateTime;

public record NotificacionDto(
        Integer idReferencia,
        String titulo,
        String mensaje,
        String tipo,
        LocalDateTime fecha) {
}