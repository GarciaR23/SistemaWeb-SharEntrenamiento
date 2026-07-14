package edu.utp.backend.features.instructor.revision.projections;

import java.time.LocalDate;
import java.time.LocalTime;

public interface RevisionPacienteProjection {
    Integer getIdReserva();

    String getNombrePaciente();

    String getUrlImagenPaciente();

    Integer getEdad();

    LocalDate getFechaReserva();

    LocalTime getHoraInicio();

    String getDuracionEntrenamiento();

    String getZonaSede();
}