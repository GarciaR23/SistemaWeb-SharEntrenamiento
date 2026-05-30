package edu.utp.backend.features.sede.dtos;

public record SedeDto(
        Integer idSede,
        Integer idInstructor,
        String urlImagenSede1,
        String urlImagenSede2,
        String urlImagenSede3,
        String descripcionSede,
        String direccionSede,
        String distritoSede,
        Boolean estadoActivacion) {
}