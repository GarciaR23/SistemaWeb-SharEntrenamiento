package edu.utp.backend.features.admin.reporte.controllers;

import java.util.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.utp.backend.features.admin.reporte.entities.VistaMonitoreoIns;
import edu.utp.backend.features.admin.reporte.entities.VistaMonitoreoPaciente;
import edu.utp.backend.features.admin.reporte.services.MonitoreoInstService;
import edu.utp.backend.features.admin.reporte.services.MonitoreoPacService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/monitoreo")
@RequiredArgsConstructor
public class MonitoreoController {

    private final MonitoreoInstService instService;
    private final MonitoreoPacService pacService;

    @GetMapping("/instructor")
    public ResponseEntity<List<VistaMonitoreoIns>> findAllInstructores() {
        return ResponseEntity.ok(instService.findAll());
    }

    @GetMapping("/instructor/conteo")
    public ResponseEntity<Map<String, Long>> obtenerConteo() {
        return ResponseEntity.ok(instService.obtenerConteoMonitoreo());
    }

    @GetMapping("/paciente")
    public ResponseEntity<List<VistaMonitoreoPaciente>> findAllPacientes() {
        return ResponseEntity.ok(pacService.findAll());
    }

    @GetMapping("/paciente/conteo")
    public ResponseEntity<Map<String, Long>> obtenerConteoPaciente() {
        return ResponseEntity.ok(pacService.obtenerConteo());
    }
}