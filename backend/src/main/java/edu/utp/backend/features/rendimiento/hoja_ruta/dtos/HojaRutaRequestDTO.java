package edu.utp.backend.features.rendimiento.hoja_ruta.dtos;

import jakarta.validation.constraints.NotNull;

public record HojaRutaRequestDTO(
        @NotNull Integer idReserva) {
}