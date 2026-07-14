package edu.utp.backend.features.reserva.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.utp.backend.core.exception.HorarioOcupadoException;
import edu.utp.backend.features.reserva.dtos.ReservaDto;
import edu.utp.backend.features.reserva.dtos.ReservaRequestDto;
import edu.utp.backend.features.reserva.dtos.ReservaTutorSesionDto;
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

    @GetMapping("/tutor/{idTutor}")
    public ResponseEntity<List<ReservaTutorSesionDto>> findSesionesByTutor(@PathVariable Integer idTutor) {
        return ResponseEntity.ok(reservaService.findSesionesByTutor(idTutor));
    }

    @PostMapping("/validar")
    public ResponseEntity<?> validar(@Valid @RequestBody ReservaRequestDto request) {
        try {
            reservaService.validarDisponibilidad(request);
            return ResponseEntity.ok(Map.of("success", true, "message", "Horario disponible"));
        } catch (HorarioOcupadoException ex) {
            return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", ex.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ReservaDto> create(@Valid @RequestBody ReservaRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reservaService.create(request));
    }

    @PatchMapping("/detalle/{idDetalle}/cancelar")
    public ResponseEntity<?> cancelarDetalle(@PathVariable Integer idDetalle) {
        try {
            reservaService.cancelarDetalle(idDetalle);
            return ResponseEntity.ok(Map.of("success", true, "message", "Reserva cancelada correctamente."));
        } catch (IllegalStateException | IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", ex.getMessage()));
        }
    }
}