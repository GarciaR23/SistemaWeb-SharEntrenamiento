package edu.utp.backend.features.pago.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PagoDto(
        Integer idPago,
        Integer idReserva,
        Integer idPaciente,
        Integer idInstructor,
        BigDecimal montoTotal,
        String metodoPago,
        LocalDateTime fechaPago,
        String estadoPago) {
}