package edu.utp.backend.features.reserva.dtos;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record ReservaRequestDto(

                @NotNull(message = "El paciente es obligatorio") Integer idPaciente,

                @NotNull(message = "El instructor es obligatorio") Integer idInstructor,

                @NotNull(message = "La sede es obligatoria") Integer idSede,

                @NotNull(message = "El monto total acumulado es obligatorio") BigDecimal montoTotalAcumulado,

                @Valid @NotNull(message = "Debe incluir al menos un detalle de reserva") List<DetalleReservaRequest> detalles) {
}