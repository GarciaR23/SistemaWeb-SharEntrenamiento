package edu.utp.backend.features.plan.services;

import edu.utp.backend.features.plan.dtos.AjusteHojaRutaRequest;
import edu.utp.backend.features.plan.dtos.PlanTutorDto;

import java.util.List;

public interface PlanService {

    PlanTutorDto obtenerPlanPorReserva(Integer idReserva);

    List<PlanTutorDto> listarPlanesPorTutor(Integer idTutor);

    PlanTutorDto marcarComoVisto(Integer idReserva);

    PlanTutorDto solicitarAjuste(Integer idReserva, Integer idRuta, AjusteHojaRutaRequest request);

    void aceptarHojaRuta(Integer idRuta);
}