package edu.utp.backend.features.actividad.services;

import edu.utp.backend.features.actividad.dtos.*;

import java.util.List;

public interface ActividadService {

        List<ActividadTutorDto> listarPorTutor(Integer idTutor);

        ActividadTutorDto iniciarActividad(Integer idDetalle, String pin);

        ActividadTutorDto registrarIncidencia(
                        Integer idSesion,
                        IncidenciaActividadRequest request);

        ActividadTutorDto confirmarPago(
                        Integer idDetalle,
                        PagoActividadRequest request);

        ActividadTutorDto aceptarReprogramacion(
                        Integer idDetalle,
                        AceptarReprogramacionRequest request);

        ReporteTecnicoDto obtenerReportePorReserva(Integer idReserva);
}