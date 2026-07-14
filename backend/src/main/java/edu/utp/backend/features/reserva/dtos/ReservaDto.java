package edu.utp.backend.features.reserva.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record ReservaDto(
        Integer idReserva,
        Integer idPaciente,
        Integer idInstructor,
        Integer idSede,
        String totalHorasAcumuladas,
        BigDecimal montoTotalAcumulado,
        LocalDateTime fechaCreacion,
        List<DetalleReservaDto> detalles) {
}