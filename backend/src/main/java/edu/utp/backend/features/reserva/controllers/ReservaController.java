package edu.utp.backend.features.reserva.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.utp.backend.features.reserva.dtos.ReservaDto;
import edu.utp.backend.features.reserva.services.ReservaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reservas")
@RequiredArgsConstructor
public class ReservaController {

    private final ReservaService reservaService;

    @GetMapping
    public ResponseEntity<List<ReservaDto>> findAll() {
        return ResponseEntity.ok(reservaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservaDto> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(reservaService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ReservaDto> create(@Valid @RequestBody ReservaDto request) {
        return ResponseEntity.ok(reservaService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservaDto> update(@PathVariable Integer id, @Valid @RequestBody ReservaDto request) {
        return ResponseEntity.ok(reservaService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        reservaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}