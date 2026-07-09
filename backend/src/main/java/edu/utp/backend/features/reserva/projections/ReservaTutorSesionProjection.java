package edu.utp.backend.features.reserva.projections;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface ReservaTutorSesionProjection {
    Integer getIdReserva();

    Integer getIdDetalle(); // ✅ NUEVO

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

    BigDecimal getMontoSubtotal(); // ✅ CAMBIADO: monto del detalle, no de la reserva

    String getEstadoReserva();

    String getEstadoSesion();

    LocalDateTime getFechaCreacion();
}