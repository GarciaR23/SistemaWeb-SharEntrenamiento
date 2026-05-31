package edu.utp.backend.features.admin.revision.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.utp.backend.features.admin.revision.enums.TipoAprobacion;
import edu.utp.backend.features.admin.revision.services.AdminRevisionService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/revisiones")
@RequiredArgsConstructor
public class AdminRevisionController {

    private final AdminRevisionService adminRevisionService;

    @PostMapping("/instructor/{idInstructor}/documento/{idDocumento}")
    public ResponseEntity<Map<String, String>> evaluarDocumento(
            @PathVariable Long idInstructor,
            @PathVariable Long idDocumento,
            @RequestParam String estado,
            @RequestParam(required = false) String comentario,
            @RequestParam Integer idAdmin) {

        TipoAprobacion estadoDestino = TipoAprobacion.valueOf(estado.toLowerCase());
        adminRevisionService.procesarRevisionDocumento(idInstructor, idDocumento, estadoDestino, comentario, idAdmin);

        return ResponseEntity.ok(Map.of("mensaje", "Evaluación del documento registrada correctamente."));
    }

    @GetMapping("/documento/{idDocumento}/historial-rechazos")
    public ResponseEntity<List<Map<String, Object>>> obtenerHistorialRechazosPorDocumento(
            @PathVariable Long idDocumento) {
        return ResponseEntity.ok(adminRevisionService.obtenerHistorialRechazosPorDocumento(idDocumento));
    }
}