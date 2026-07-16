package edu.utp.backend.features.instructor.projections;

public interface InstructorPerfilResumenProjection {
    Integer getIdInstructor();
    String getNombreCompleto();
    String getUrlImagenPerfil();
    String getEspecialidad();
    String getBiografia();
    String getDireccion();
    String getDistrito();
}