package edu.utp.backend.features.sede.dtos;

public record SedeResumenDTO(
        Integer idSede,
        String nombreSede,
        String zonaSede,
        String urlImagenSede1,
        String urlImagenSede2,
        String urlImagenSede3) {
}