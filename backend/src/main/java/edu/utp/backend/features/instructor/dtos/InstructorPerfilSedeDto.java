package edu.utp.backend.features.instructor.dtos;

public record InstructorPerfilSedeDto(
        Integer idSede,
        String urlImagenSede1,
        String urlImagenSede2,
        String urlImagenSede3,
        String descripcionSede,
        String direccionSede,
        String distritoSede,
        Boolean estadoActivacion
) {
}