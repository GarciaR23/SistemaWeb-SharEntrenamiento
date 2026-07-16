package edu.utp.backend.features.plan.dtos;

import java.time.LocalDateTime;

public record AjusteHojaRutaDto(
        Integer idAjuste,
        Integer idRuta,
        Integer idEjercicioOriginal,
        String nombreEjercicioOriginal,
        String motivoCambio,
        String motivoDetallado,
        String ejercicioModificado,
        String comentarioSupervisor,
        Boolean autorizadoPorInstructor,
        LocalDateTime fechaAjuste) {
}