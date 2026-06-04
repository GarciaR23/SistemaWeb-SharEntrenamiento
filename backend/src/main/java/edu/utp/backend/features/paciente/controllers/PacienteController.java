package edu.utp.backend.features.paciente.controllers;

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
import edu.utp.backend.features.paciente.repositories.PacienteRepository;
import edu.utp.backend.features.paciente.dtos.PacienteDto;
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

    /*NO DEBERÍA DE IR REPOSITORY EN CONTROLLER SI NO EN SERVICES - CORREGIR ELLO */
    private final PacienteRepository pacienteRepository;

    @GetMapping("/tutor/{idTutor}")
    public ResponseEntity<List<PacienteDto>> findByIdTutor(@PathVariable Integer idTutor) {
        List<PacienteDto> pacientes = pacienteRepository.findByIdTutor(idTutor)
                .stream()
                .map(paciente -> new PacienteDto(
                        paciente.getIdPaciente(),
                        paciente.getIdTutor(),
                        paciente.getNombreCompleto(),
                        paciente.getUrlImagenPaciente(),
                        paciente.getCondicion(),
                        paciente.getGradoAutismo(),
                        paciente.getGenero(),
                        paciente.getEdad(),
                        paciente.getDistrito(),
                        paciente.getDireccion()))
                .toList();

        return ResponseEntity.ok(pacientes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PacienteDto> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(pacienteService.findById(id));
    }

    @PostMapping
    public ResponseEntity<PacienteDto> create(@Valid @RequestBody PacienteDto request) {
        return ResponseEntity.ok(pacienteService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PacienteDto> update(@PathVariable Integer id, @Valid @RequestBody PacienteDto request) {
        return ResponseEntity.ok(pacienteService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        pacienteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}