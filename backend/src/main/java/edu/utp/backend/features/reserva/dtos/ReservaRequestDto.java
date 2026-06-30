package edu.utp.backend.features.reserva.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ReservaRequestDto(

        @NotNull(message = "El paciente es obligatorio")
        Integer idPaciente,

        @NotNull(message = "El instructor es obligatorio")
        Integer idInstructor,

        @NotNull(message = "La sede es obligatoria")
        Integer idSede,

        @NotNull(message = "El horario es obligatorio")
        @Future(message = "La fecha y hora de reserva debe ser futura")
        LocalDateTime seleccionHorario,

        @NotNull(message = "La duración es obligatoria")
        @Min(value = 30, message = "La duración mínima debe ser de 30 minutos")
        Integer duracionMinutos,

        @NotNull(message = "El monto total es obligatorio")
        @DecimalMin(value = "0.0", inclusive = false, message = "El monto debe ser mayor a 0")
        BigDecimal montoTotal
) {
}