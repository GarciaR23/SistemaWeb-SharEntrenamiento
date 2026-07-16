package edu.utp.backend.features.actividad.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record ActividadTutorDto(
        Integer idReserva,
        Integer idDetalle,
        Integer idSesion,

        Integer idPaciente,
        Integer idInstructor,
        Integer idSede,

        String pacienteNombre,
        Integer pacienteEdad,
        String pacienteImagen,

        String instructorNombre,
        String especialidad,

        String nombreSede,
        String direccionSede,

        LocalDateTime horaInicioEstimada,
        LocalDateTime horaFinEstimada,
        Integer duracionMinutos,
        BigDecimal montoSubtotal,

        String estadoDetalle,
        String estadoSesion,
        String estadoHoja,

        Boolean hojaRutaAceptada,
        Boolean pagoRegistrado,

        Integer idReprogramar,
        String motivoReprogramacion,
        Boolean respuestaTutor,

        String contactoEmergenciaNombre,
        String contactoEmergenciaTelefono,
        String contactoEmergenciaRelacion,
        String protocoloEmergencia,

        List<PropuestaReprogramacionDto> propuestas) {
}