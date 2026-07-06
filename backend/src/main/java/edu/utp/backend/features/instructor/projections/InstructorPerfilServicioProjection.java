package edu.utp.backend.features.instructor.projections;

import java.math.BigDecimal;
import java.time.LocalTime;

public interface InstructorPerfilServicioProjection {
    Integer getIdServicio();
    BigDecimal getTarifaHora();
    String getHorarioPreferencia();
    String getDiaSemana();
    LocalTime getHorarioInicio();
    LocalTime getHorarioFinal();
}