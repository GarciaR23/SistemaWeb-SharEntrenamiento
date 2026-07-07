package edu.utp.backend.features.instructor.projections;

import java.time.LocalDateTime;

public interface InstructorPerfilCalificacionProjection {
    Integer getIdCalificacion();

    Integer getIdPaciente();

    String getPacienteNombre();

    Integer getPuntajeEstrellas();

    String getComentarioTutor();

    LocalDateTime getFechaCalificacion();
}