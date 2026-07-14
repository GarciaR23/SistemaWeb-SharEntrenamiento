package edu.utp.backend.features.instructor.analitica.dtos;

public record GraficoSesionesDto(
        Integer numeroDia,
        String nombreDia,
        Long totalSesiones) {
}