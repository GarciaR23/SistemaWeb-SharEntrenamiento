package edu.utp.backend.features.sede.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.utp.backend.features.sede.dtos.SedeRequest;
import edu.utp.backend.features.sede.dtos.SedeResponse;
import edu.utp.backend.features.sede.services.SedeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/sedes")
@RequiredArgsConstructor
public class SedeController {

    private final SedeService sedeService;

    @GetMapping
    public ResponseEntity<List<SedeResponse>> findAll() {
        return ResponseEntity.ok(sedeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SedeResponse> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(sedeService.findById(id));
    }

    @PostMapping
    public ResponseEntity<SedeResponse> create(@Valid @RequestBody SedeRequest request) {
        return ResponseEntity.ok(sedeService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SedeResponse> update(
            @PathVariable Integer id,
            @Valid @RequestBody SedeRequest request
    ) {
        return ResponseEntity.ok(sedeService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        sedeService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/instructor/{idInstructor}")
    public ResponseEntity<List<SedeResponse>> listarPorInstructor(@PathVariable Integer idInstructor) {
        return ResponseEntity.ok(sedeService.listarPorInstructor(idInstructor));
    }

    @GetMapping("/instructor/{idInstructor}/buscar/distrito")
    public ResponseEntity<List<SedeResponse>> buscarPorDistrito(
            @PathVariable Integer idInstructor,
            @RequestParam String distrito
    ) {
        return ResponseEntity.ok(sedeService.buscarPorDistrito(idInstructor, distrito));
    }

    @GetMapping("/instructor/{idInstructor}/buscar/direccion")
    public ResponseEntity<List<SedeResponse>> buscarPorDireccion(
            @PathVariable Integer idInstructor,
            @RequestParam String direccion
    ) {
        return ResponseEntity.ok(sedeService.buscarPorDireccion(idInstructor, direccion));
    }

    @PutMapping("/{idSede}/estado")
    public ResponseEntity<SedeResponse> actualizarEstado(
            @PathVariable Integer idSede,
            @RequestBody Map<String, Boolean> request
    ) {
        return ResponseEntity.ok(
                sedeService.actualizarEstado(idSede, request.get("estadoActivacion"))
        );
    }
}