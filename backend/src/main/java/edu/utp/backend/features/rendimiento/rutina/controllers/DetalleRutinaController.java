package edu.utp.backend.features.rendimiento.rutina.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.utp.backend.features.rendimiento.rutina.dtos.DetalleRutinaRequestDTO;
import edu.utp.backend.features.rendimiento.rutina.dtos.DetalleRutinaResponseDTO;
import edu.utp.backend.features.rendimiento.rutina.services.DetalleRutinaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/detalle-rutina")
@RequiredArgsConstructor
public class DetalleRutinaController {

    private final DetalleRutinaService detalleRutinaService;

    @GetMapping
    public ResponseEntity<List<DetalleRutinaResponseDTO>> findAll() {
        return ResponseEntity.ok(detalleRutinaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DetalleRutinaResponseDTO> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(detalleRutinaService.findById(id));
    }

    @GetMapping("/ruta/{idRuta}")
    public ResponseEntity<List<DetalleRutinaResponseDTO>> findByIdRuta(@PathVariable Integer idRuta) {
        return ResponseEntity.ok(detalleRutinaService.findByIdRuta(idRuta));
    }

    @PostMapping
    public ResponseEntity<DetalleRutinaResponseDTO> create(@Valid @RequestBody DetalleRutinaRequestDTO request) {
        return ResponseEntity.ok(detalleRutinaService.create(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        detalleRutinaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}