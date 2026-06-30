package edu.utp.backend.features.reserva.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.utp.backend.features.reserva.dtos.ReservaDto;
import edu.utp.backend.features.reserva.dtos.ReservaRequestDto;
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

    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<List<ReservaDto>> findByPaciente(@PathVariable Integer idPaciente) {
        return ResponseEntity.ok(reservaService.findByPaciente(idPaciente));
    }

    @GetMapping("/instructor/{idInstructor}")
    public ResponseEntity<List<ReservaDto>> findByInstructor(@PathVariable Integer idInstructor) {
        return ResponseEntity.ok(reservaService.findByInstructor(idInstructor));
    }

    @PostMapping
    public ResponseEntity<ReservaDto> create(@Valid @RequestBody ReservaRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reservaService.create(request));
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelar(@PathVariable Integer id) {
        reservaService.cancelar(id);
        return ResponseEntity.noContent().build();
    }
}