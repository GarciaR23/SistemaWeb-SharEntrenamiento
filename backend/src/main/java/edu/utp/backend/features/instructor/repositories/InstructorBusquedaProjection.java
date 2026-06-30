package edu.utp.backend.features.instructor.repositories;

import java.math.BigDecimal;
import java.time.LocalTime;

public interface InstructorBusquedaProjection {

    Integer getIdInstructor();

    String getNombreCompleto();

    String getUrlImagenPerfil();

    String getEspecialidad();

    String getBiografia();

    String getDistrito();

    String getDireccion();

    Integer getIdSede();

    String getDireccionSede();

    String getDistritoSede();

    BigDecimal getTarifaHora();

    String getHorarioPreferencia();

    String getDiaDisponible();

    LocalTime getHorarioInicio();

    LocalTime getHorarioFinal();

    BigDecimal getPromedioCalificacion();

    Long getTotalSesiones();
}