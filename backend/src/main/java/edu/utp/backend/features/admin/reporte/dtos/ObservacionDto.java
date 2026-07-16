package edu.utp.backend.features.admin.reporte.dtos;

public record ObservacionDto(
        Integer idIncidencia,
        Integer idSesion,
        String tipoReclamo,
        String fotoPaciente,
        String nombrePaciente,
        String fotoInstructor,
        String nombreInstructor,
        String detalleReclamo,
        String nivelGravedad,
        String urlEvidencia1,
        String urlEvidencia2,
        String urlEvidencia3,
        String accionSugerida) {
}