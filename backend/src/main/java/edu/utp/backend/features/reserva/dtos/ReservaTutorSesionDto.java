package edu.utp.backend.features.reserva.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ReservaTutorSesionDto(
        Integer idReserva,
        Integer idDetalle, 
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
        LocalDateTime horaInicioEstimada,
        LocalDateTime horaFinEstimada,
        Integer duracionMinutos,
        BigDecimal montoSubtotal, 
        String estadoReserva,
        String estadoSesion,
        LocalDateTime fechaCreacion) {
}