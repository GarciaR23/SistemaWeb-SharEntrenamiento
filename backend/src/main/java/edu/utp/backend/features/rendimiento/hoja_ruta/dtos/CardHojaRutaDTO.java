package edu.utp.backend.features.rendimiento.hoja_ruta.dtos;

import java.time.LocalDateTime;

public record CardHojaRutaDTO(
        Integer idReserva,
        Integer idRuta,
        String imagenPaciente,
        String nombrePaciente,
        String duracionEntrenamiento,
        String nombreSede,
        String zonaSede,
        String clasificacion,
        String estadoHoja,
        LocalDateTime fechaCreacion) {
}