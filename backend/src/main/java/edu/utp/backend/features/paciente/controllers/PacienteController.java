package edu.utp.backend.features.paciente.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.utp.backend.features.paciente.dtos.ContactoEmergenciaDto;
import edu.utp.backend.features.paciente.dtos.PacienteDto;
import edu.utp.backend.features.paciente.dtos.ProtocoloEmergenciaDto;
import edu.utp.backend.features.paciente.dtos.SensibilidadPacienteDto;
import edu.utp.backend.features.paciente.services.PacienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/pacientes")
@RequiredArgsConstructor
public class PacienteController {

    private final PacienteService pacienteService;

    @GetMapping
    public ResponseEntity<List<PacienteDto>> findAll() {
        return ResponseEntity.ok(pacienteService.findAll());
    }

    @GetMapping("/tutor/{idTutor}")
    public ResponseEntity<List<PacienteDto>> findByIdTutor(@PathVariable Integer idTutor) {
        return ResponseEntity.ok(pacienteService.findByIdTutor(idTutor));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PacienteDto> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(pacienteService.findById(id));
    }

    @PostMapping
    public ResponseEntity<PacienteDto> create(@Valid @RequestBody PacienteDto request) {
        return ResponseEntity.ok(pacienteService.create(request));
    }

    @PostMapping("/{idPaciente}/protocolo-emergencia")
    public ResponseEntity<ProtocoloEmergenciaDto> crearProtocoloEmergencia(
            @PathVariable Integer idPaciente,
            @RequestBody ProtocoloEmergenciaDto request) {
        return ResponseEntity.ok(pacienteService.crearProtocoloEmergencia(idPaciente, request));
    }

    @PostMapping("/{idPaciente}/contacto-emergencia")
    public ResponseEntity<ContactoEmergenciaDto> crearContactoEmergencia(
            @PathVariable Integer idPaciente,
            @RequestBody ContactoEmergenciaDto request) {
        return ResponseEntity.ok(pacienteService.crearContactoEmergencia(idPaciente, request));
    }

    @PostMapping("/{idPaciente}/sensibilidades")
    public ResponseEntity<SensibilidadPacienteDto> crearSensibilidadPaciente(
            @PathVariable Integer idPaciente,
            @RequestBody SensibilidadPacienteDto request) {
        return ResponseEntity.ok(pacienteService.crearSensibilidadPaciente(idPaciente, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PacienteDto> update(
            @PathVariable Integer id,
            @Valid @RequestBody PacienteDto request) {
        return ResponseEntity.ok(pacienteService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        pacienteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}