package edu.utp.backend.features.admin.reporte.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import edu.utp.backend.features.admin.reporte.entities.VistaMonitoreoIns;
import edu.utp.backend.features.admin.reporte.services.FiltroMonitoreoInstService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/filtro")
@RequiredArgsConstructor
public class FiltroMonitoreoInstController {

    @Autowired
    private FiltroMonitoreoInstService instService;

    @GetMapping("/instructor/buscar")
    public ResponseEntity<List<VistaMonitoreoIns>> buscarPorNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(instService.buscarPorNombre(nombre));
    }

}
