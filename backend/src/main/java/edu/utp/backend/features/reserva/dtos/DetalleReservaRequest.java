package edu.utp.backend.features.reserva.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record DetalleReservaRequest(

                @NotNull(message = "La hora de inicio es obligatoria")
                LocalDateTime horaInicioEstimada,

                @NotNull(message = "La duración es obligatoria") @Min(value = 30, message = "La duración mínima debe ser de 30 minutos") Integer duracionMinutos,

                @NotNull(message = "El monto subtotal es obligatorio") @DecimalMin(value = "0.0", inclusive = false, message = "El monto debe ser mayor a 0") BigDecimal montoSubtotal) {
}