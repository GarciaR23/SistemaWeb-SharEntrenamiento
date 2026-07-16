package edu.utp.backend.features.notificacion.dtos;

import java.util.List;

public record NotificacionesResponse(
        List<NotificacionDto> notificaciones,
        Long total) {
}