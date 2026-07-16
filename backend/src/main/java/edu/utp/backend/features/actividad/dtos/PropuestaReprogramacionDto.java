package edu.utp.backend.features.actividad.dtos;

import java.time.LocalDate;
import java.time.LocalTime;

public record PropuestaReprogramacionDto(
                Integer idDetalleReprogramar,
                Integer idReprogramar,
                LocalDate fechaPropuesta,
                LocalTime horaInicioPropuesta,
                LocalTime horaFinPropuesta,
                Boolean esSeleccionada) {
}