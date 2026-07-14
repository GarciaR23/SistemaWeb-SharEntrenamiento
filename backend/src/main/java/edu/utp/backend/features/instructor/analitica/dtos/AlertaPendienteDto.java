package edu.utp.backend.features.instructor.analitica.dtos;

public record AlertaPendienteDto(
        Integer idInstructor,
        String tipoAlerta,
        String mensaje,
        Integer idReferencia) {
}