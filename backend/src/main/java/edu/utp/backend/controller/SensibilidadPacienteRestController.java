package edu.utp.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.utp.backend.entity.SensibilidadPaciente;
import edu.utp.backend.service.SensibilidadPacienteService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/sensibilidades")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class SensibilidadPacienteRestController {

    private final SensibilidadPacienteService sensibilidadPacienteService;

    @GetMapping
    public ResponseEntity<List<SensibilidadPaciente>> getAll() {
        return ResponseEntity.ok(sensibilidadPacienteService.findAll());
    }

    @PostMapping
    public ResponseEntity<SensibilidadPaciente> create(@RequestBody SensibilidadPaciente sensibilidad) {
        return new ResponseEntity<>(sensibilidadPacienteService.create(sensibilidad), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SensibilidadPaciente> update(
            @PathVariable Integer id,
            @RequestBody SensibilidadPaciente sensibilidad) {
        return ResponseEntity.ok(sensibilidadPacienteService.update(id, sensibilidad));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        sensibilidadPacienteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
