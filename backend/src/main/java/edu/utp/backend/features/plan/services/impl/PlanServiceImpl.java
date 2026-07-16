package edu.utp.backend.features.plan.services.impl;

import edu.utp.backend.features.plan.dtos.AjusteHojaRutaRequest;
import edu.utp.backend.features.plan.dtos.PlanTutorDto;
import edu.utp.backend.features.plan.repositories.PlanRepository;
import edu.utp.backend.features.plan.services.PlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PlanServiceImpl implements PlanService {

    private final PlanRepository planRepository;

    @Override
    public PlanTutorDto obtenerPlanPorReserva(Integer idReserva) {
        return planRepository.obtenerPlanPorReserva(idReserva);
    }

    @Override
    @Transactional
    public PlanTutorDto marcarComoVisto(Integer idReserva) {
        PlanTutorDto plan = planRepository.obtenerPlanPorReserva(idReserva);
        planRepository.marcarComoVisto(plan.idRuta());

        return planRepository.obtenerPlanPorReserva(idReserva);
    }

    @Override
    @Transactional
    public PlanTutorDto solicitarAjuste(
            Integer idReserva,
            Integer idRuta,
            AjusteHojaRutaRequest request) {
        PlanTutorDto plan = planRepository.obtenerPlanPorReserva(idReserva);

        if (plan.estadoSesion().equals("finalizado") || Boolean.TRUE.equals(plan.pagoRegistrado())) {
            throw new IllegalStateException("No se puede solicitar ajuste porque la sesión ya finalizó.");
        }

        planRepository.registrarAjuste(idRuta, request);

        return planRepository.obtenerPlanPorReserva(idReserva);
    }

    @Override
    @Transactional
    public void aceptarHojaRuta(Integer idRuta) {
        planRepository.aceptarHojaRuta(idRuta);
        planRepository.activarDetalleReserva(idRuta);
    }

    @Override
    public List<PlanTutorDto> listarPlanesPorTutor(Integer idTutor) {
        return planRepository.listarPlanesPorTutor(idTutor);
    }
}