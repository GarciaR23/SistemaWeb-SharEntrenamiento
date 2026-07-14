package edu.utp.backend.features.rendimiento.hoja_ruta.dtos;

import edu.utp.backend.features.sede.dtos.SedeResumenDTO;

public record FormularioHojaRutaDTO(
        Integer idReserva,
        String imagenPaciente,
        String nombrePaciente,
        String duracionEntrenamiento,
        SedeResumenDTO sedeSeleccionada) {
}