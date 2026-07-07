package edu.utp.backend.features.reserva.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ReservaTutorSesionDto(
        Integer idReserva,
        Integer idPaciente,
        String pacienteNombre,
        String pacienteImagen,
        Integer idInstructor,
        String instructorNombre,
        String instructorImagen,
        String especialidad,
        Integer idSede,
        String nombreSede,
        String direccionSede,
        LocalDateTime seleccionHorario,
        Integer duracionMinutos,
        BigDecimal montoTotal,
        String estadoReserva,
        String estadoSesion,
        LocalDateTime fechaCreacion
) {
}