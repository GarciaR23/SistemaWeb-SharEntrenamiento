package edu.utp.backend.features.sede.dtos;

import java.util.List;

import edu.utp.backend.features.sede.enums.ZonaSedeEnum;

public record SedeResponse(
        Integer idSede,
        Integer idInstructor,
        ZonaSedeEnum zonaSede,
        String nombreSede,
        String urlImagenSede1,
        String urlImagenSede2,
        String urlImagenSede3,
        String descripcionSede,
        String direccionSede,
        String distritoSede,
        Boolean estadoActivacion,
        String nombreCard,
        List<String> imagenes,
        String etiqueta) {
}