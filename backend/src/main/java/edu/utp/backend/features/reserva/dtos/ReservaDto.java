package edu.utp.backend.features.reserva.dtos;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;

public record ReservaDto(
        Integer idReserva,
        Integer idPaciente,
        Integer idInstructor,
        Integer idSede,
        LocalDateTime seleccionHorario,
        Duration duracionEntrenamiento,
        BigDecimal montoTotal,
        String estadoReserva,
        LocalDateTime fechaCreacion) {
}