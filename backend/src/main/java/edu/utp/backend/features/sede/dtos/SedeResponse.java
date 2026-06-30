package edu.utp.backend.features.sede.dtos;

import java.util.List;

public record SedeResponse(
        Integer idSede,
        Integer idInstructor,
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