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

    LocalDateTime getHoraInicioEstimada();

    LocalDateTime getHoraFinEstimada();

    Integer getDuracionMinutos();

    BigDecimal getMontoTotalAcumulado();

    String getEstadoReserva();

    String getEstadoSesion();

    LocalDateTime getFechaCreacion();
}