package edu.utp.backend.features.reserva.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import edu.utp.backend.features.reserva.entities.DetalleReserva;

public record ReservaDto(
                Integer idReserva,
                Integer idPaciente,
                Integer idInstructor,
                Integer idSede,
                String totalHorasAcumuladas,
                BigDecimal montoTotalAcumulado,
                String estadoReserva,
                LocalDateTime fechaCreacion,
                LocalDateTime fechaRevision,
                List<DetalleReserva> detalles) {
}