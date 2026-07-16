package edu.utp.backend.features.reserva.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DetalleReservaDto(
        Integer idDetalle,
        LocalDateTime horaInicioEstimada,
        LocalDateTime horaFinEstimada,
        String duracionEntrenamiento,
        BigDecimal montoSubtotal) {
}