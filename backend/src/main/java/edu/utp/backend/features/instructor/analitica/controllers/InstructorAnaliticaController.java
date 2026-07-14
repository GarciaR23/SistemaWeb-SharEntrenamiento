package edu.utp.backend.features.instructor.analitica.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.utp.backend.features.instructor.analitica.dtos.AgendaHoyDto;
import edu.utp.backend.features.instructor.analitica.dtos.AlertaPendienteDto;
import edu.utp.backend.features.instructor.analitica.dtos.CalificacionPromedioDto;
import edu.utp.backend.features.instructor.analitica.dtos.GraficoSesionesDto;
import edu.utp.backend.features.instructor.analitica.dtos.PacientesActivosDto;
import edu.utp.backend.features.instructor.analitica.dtos.SesionesFinalizadasDto;
import edu.utp.backend.features.instructor.analitica.services.AnaliticaService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/instructores/analitica")
@RequiredArgsConstructor
public class InstructorAnaliticaController {

    private final AnaliticaService analiticaService;

    @GetMapping("/calificacion-promedio")
    public ResponseEntity<CalificacionPromedioDto> obtenerPromedioCalificacion() {
        return ResponseEntity.ok(analiticaService.obtenerPromedioCalificacion());
    }

    @GetMapping("/pacientes-activos")
    public ResponseEntity<PacientesActivosDto> obtenerPacientesActivos() {
        return ResponseEntity.ok(analiticaService.obtenerPacientesActivos());
    }

    @GetMapping("/sesiones-finalizadas")
    public ResponseEntity<SesionesFinalizadasDto> obtenerSesionesFinalizadas() {
        return ResponseEntity.ok(analiticaService.obtenerSesionesFinalizadas());
    }

    @GetMapping("/grafico-sesiones/{idInstructor}")
    public ResponseEntity<List<GraficoSesionesDto>> obtenerGraficoSesiones(
            @PathVariable Long idInstructor) {
        return ResponseEntity.ok(analiticaService.obtenerGraficoSesiones(idInstructor));
    }

    @GetMapping("/agenda-hoy/{idInstructor}")
    public ResponseEntity<List<AgendaHoyDto>> obtenerAgendaHoy(
            @PathVariable Integer idInstructor) {
        return ResponseEntity.ok(analiticaService.obtenerAgendaHoy(idInstructor));
    }

    @GetMapping("/alertas-pendientes/{idInstructor}")
    public ResponseEntity<List<AlertaPendienteDto>> obtenerAlertasPendientes(
            @PathVariable Integer idInstructor) {
        return ResponseEntity.ok(analiticaService.obtenerAlertasPendientes(idInstructor));
    }
}