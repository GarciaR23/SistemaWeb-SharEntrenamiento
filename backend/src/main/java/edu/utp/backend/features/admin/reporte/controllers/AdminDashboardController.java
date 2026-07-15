package edu.utp.backend.features.admin.reporte.controllers;

import java.time.LocalDateTime;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.utp.backend.features.admin.reporte.dtos.DashboardEstadoSolicitudDto;
import edu.utp.backend.features.admin.reporte.dtos.DashboardInstructoresDto;
import edu.utp.backend.features.admin.reporte.dtos.PacienteControlDto;
import edu.utp.backend.features.admin.reporte.services.AdminDashboardService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    @GetMapping("/control-pacientes")
    public ResponseEntity<PacienteControlDto> obtenerControlPacientes() {
        return ResponseEntity.ok(adminDashboardService.obtenerControlPacientes());
    }

    @GetMapping("/instructores")
    public ResponseEntity<DashboardInstructoresDto> obtenerDashboardInstructores(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {
        return ResponseEntity.ok(adminDashboardService.obtenerDashboardInstructores(fechaInicio, fechaFin));
    }

    @GetMapping("/estado-solicitudes")
    public ResponseEntity<DashboardEstadoSolicitudDto> obtenerEstadoSolicitudes() {
        return ResponseEntity.ok(adminDashboardService.obtenerEstadoSolicitudes());
    }
}