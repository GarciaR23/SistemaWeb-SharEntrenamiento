package edu.utp.backend.features.admin.reporte.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.utp.backend.features.admin.reporte.dtos.ContadorObservacionesDto;
import edu.utp.backend.features.admin.reporte.dtos.ObservacionDto;
import edu.utp.backend.features.admin.reporte.services.AdminObservacionService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/observaciones")
@RequiredArgsConstructor
public class AdminObservacionController {

    private final AdminObservacionService adminObservacionService;

    @GetMapping("/contadores")
    public ResponseEntity<ContadorObservacionesDto> obtenerContadores() {
        return ResponseEntity.ok(adminObservacionService.obtenerContadores());
    }

    @GetMapping("/tabla")
    public ResponseEntity<List<ObservacionDto>> obtenerObservaciones() {
        return ResponseEntity.ok(adminObservacionService.obtenerObservaciones());
    }

    @PutMapping("/{idIncidencia}/accion")
    public ResponseEntity<?> actualizarAccion(
            @PathVariable Integer idIncidencia,
            @RequestBody Map<String, String> body) {
        try {
            adminObservacionService.actualizarAccion(idIncidencia, body.get("accion"));
            return ResponseEntity.ok(Map.of("success", true, "message", "Acción actualizada"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}