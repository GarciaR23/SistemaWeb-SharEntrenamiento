package edu.utp.backend.features.reserva.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ReservaDto(
        Integer idReserva,
        Integer idPaciente,
        Integer idInstructor,
        Integer idSede,
        LocalDateTime seleccionHorario,
        Integer duracionMinutos,
        BigDecimal montoTotal,
        String estadoReserva,
        LocalDateTime fechaCreacion
) {
}