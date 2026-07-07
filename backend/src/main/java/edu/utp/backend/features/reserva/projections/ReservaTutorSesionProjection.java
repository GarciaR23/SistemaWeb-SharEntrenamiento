package edu.utp.backend.features.reserva.projections;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface ReservaTutorSesionProjection {
    Integer getIdReserva();

    Integer getIdPaciente();

    String getPacienteNombre();

    String getPacienteImagen();

    Integer getIdInstructor();

    String getInstructorNombre();

    String getInstructorImagen();

    String getEspecialidad();

    Integer getIdSede();

    String getNombreSede();

    String getDireccionSede();

    LocalDateTime getSeleccionHorario();

    Integer getDuracionMinutos();

    BigDecimal getMontoTotal();

    String getEstadoReserva();

    String getEstadoSesion();

    LocalDateTime getFechaCreacion();
}