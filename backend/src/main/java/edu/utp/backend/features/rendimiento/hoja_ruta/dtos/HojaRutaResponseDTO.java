package edu.utp.backend.features.rendimiento.hoja_ruta.dtos;

import java.time.LocalDateTime;

public record HojaRutaResponseDTO(
        Integer idRuta,
        Integer idReserva,
        String estadoHoja,
        LocalDateTime fechaCreacion,
        LocalDateTime fechaActualizacion) {
}