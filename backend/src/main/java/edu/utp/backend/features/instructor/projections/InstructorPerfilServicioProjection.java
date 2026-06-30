package edu.utp.backend.features.instructor.projections;

import java.math.BigDecimal;
import java.time.LocalTime;

public interface InstructorPerfilServicioProjection {
    Integer getIdServicio();
    BigDecimal getTarifaHora();
    String getHorarioPreferencia();
    String getDiaDisponible();
    LocalTime getHorarioInicio();
    LocalTime getHorarioFinal();
}