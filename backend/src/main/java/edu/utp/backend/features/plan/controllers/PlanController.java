package edu.utp.backend.features.plan.controllers;

import edu.utp.backend.features.plan.dtos.AjusteHojaRutaRequest;
import edu.utp.backend.features.plan.dtos.PlanTutorDto;
import edu.utp.backend.features.plan.services.PlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plan")
@RequiredArgsConstructor
public class PlanController {

    private final PlanService planService;

    @GetMapping("/reserva/{idReserva}")
    public PlanTutorDto obtenerPlanPorReserva(
            @PathVariable Integer idReserva) {
        return planService.obtenerPlanPorReserva(idReserva);
    }

    @PutMapping("/reserva/{idReserva}/visto")
    public PlanTutorDto marcarComoVisto(
            @PathVariable Integer idReserva) {
        return planService.marcarComoVisto(idReserva);
    }

    @PostMapping("/reserva/{idReserva}/ruta/{idRuta}/ajustes")
    public PlanTutorDto solicitarAjuste(
            @PathVariable Integer idReserva,
            @PathVariable Integer idRuta,
            @Valid @RequestBody AjusteHojaRutaRequest request) {
        return planService.solicitarAjuste(idReserva, idRuta, request);
    }

    @PutMapping("/{idRuta}/aceptar")
    public void aceptarHojaRuta(
            @PathVariable Integer idRuta) {
        planService.aceptarHojaRuta(idRuta);
    }

    @GetMapping("/tutor/{idTutor}")
    public List<PlanTutorDto> listarPlanesPorTutor(
            @PathVariable Integer idTutor) {
        return planService.listarPlanesPorTutor(idTutor);
    }
}