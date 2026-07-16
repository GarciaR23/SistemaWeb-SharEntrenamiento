package edu.utp.backend.features.tutor.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.utp.backend.features.tutor.dtos.TutorDto;
import edu.utp.backend.features.tutor.explorar_instructor.entities.VistaExplorarIns;
import edu.utp.backend.features.tutor.explorar_instructor.services.VistaExplorarInsServices;
import edu.utp.backend.features.tutor.progreso_paciente.dtos.ProgresoKpiDto;
import edu.utp.backend.features.tutor.progreso_paciente.services.ProgresoPacienteService;
import edu.utp.backend.features.tutor.services.TutorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tutores")
@RequiredArgsConstructor
public class TutorController {

    private final TutorService tutorService;
    private final VistaExplorarInsServices explorarService;
    private final ProgresoPacienteService progresoService;

    @GetMapping
    public ResponseEntity<List<TutorDto>> findAll() {
        return ResponseEntity.ok(tutorService.findAll());
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<TutorDto> findByIdUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(tutorService.findByIdUsuario(idUsuario));
    }

    @GetMapping("/explorar")
    public ResponseEntity<List<VistaExplorarIns>> explorar() {
        return ResponseEntity.ok(explorarService.findAll());
    }

    @GetMapping("progreso/paciente/{idPaciente}/kpi")
    public ResponseEntity<ProgresoKpiDto> obtenerKpi(@PathVariable Integer idPaciente) {
        return ResponseEntity.ok(progresoService.obtenerProgresoKpi(idPaciente));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TutorDto> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(tutorService.findById(id));
    }

    @PostMapping
    public ResponseEntity<TutorDto> create(@Valid @RequestBody TutorDto request) {
        return ResponseEntity.ok(tutorService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TutorDto> update(@PathVariable Integer id, @Valid @RequestBody TutorDto request) {
        return ResponseEntity.ok(tutorService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        tutorService.delete(id);
        return ResponseEntity.noContent().build();
    }

}