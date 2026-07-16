package edu.utp.backend.features.actividad.dtos;

import jakarta.validation.constraints.NotNull;

public record AceptarReprogramacionRequest(

                @NotNull Integer idDetalleReprogramar) {
}