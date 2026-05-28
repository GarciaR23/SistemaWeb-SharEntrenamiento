package edu.utp.backend.features.tutor.dtos;

public record TutorDto(
        Integer idTutor,
        Long idUsuario,
        String nombreCompleto) {
}