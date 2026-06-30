package edu.utp.backend.features.instructor.projections;

public interface InstructorPerfilSedeProjection {
    Integer getIdSede();
    String getUrlImagenSede1();
    String getUrlImagenSede2();
    String getUrlImagenSede3();
    String getDescripcionSede();
    String getDireccionSede();
    String getDistritoSede();
    Boolean getEstadoActivacion();
}