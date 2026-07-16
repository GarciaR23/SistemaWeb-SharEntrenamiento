package edu.utp.backend.features.plan.dtos;

import java.time.LocalDateTime;
import java.util.List;

public record PlanTutorDto(
        Integer idReserva,
        Integer idRuta,
        Integer idDetalle,

        Integer idPaciente,
        String pacienteNombre,

        Integer idInstructor,
        String instructorNombre,
        String especialidad,
        String imagenInstructor,

        Integer idSede,
        String nombreSede,
        String descripcionSede,
        String direccionSede,
        String distritoSede,
        String zonaSede,

        LocalDateTime horaInicioEstimada,
        LocalDateTime horaFinEstimada,

        String estadoHoja,
        String estadoDetalle,
        String estadoSesion,
        Boolean pagoRegistrado,

        List<String> imagenesSede,
        List<DetalleRutinaPlanDto> ejercicios,
        List<AjusteHojaRutaDto> ajustes) {
}