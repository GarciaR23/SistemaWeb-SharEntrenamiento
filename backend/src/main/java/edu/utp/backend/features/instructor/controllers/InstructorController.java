package edu.utp.backend.features.instructor.controllers;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.utp.backend.features.instructor.dtos.InstructorBusquedaResponse;
import edu.utp.backend.features.instructor.dtos.InstructorRequest;
import edu.utp.backend.features.instructor.dtos.InstructorResponse;
import edu.utp.backend.features.instructor.services.InstructorService;
import edu.utp.backend.features.instructor.dtos.InstructorPerfilResumenDto;
import edu.utp.backend.features.instructor.dtos.InstructorPerfilSedeDto;
import edu.utp.backend.features.instructor.dtos.InstructorPerfilServicioDto;
import edu.utp.backend.features.instructor.dtos.InstructorPerfilCalificacionDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/instructores")
@RequiredArgsConstructor
public class InstructorController {

    private final InstructorService instructorService;

    @GetMapping
    public ResponseEntity<List<InstructorResponse>> findAll() {
        return ResponseEntity.ok(instructorService.findAll());
    }

    @GetMapping("/busqueda")
    public ResponseEntity<List<InstructorBusquedaResponse>> buscarInstructoresParaTutor(
            @RequestParam(required = false) String texto,
            @RequestParam(required = false) String distrito,
            @RequestParam(required = false) String especialidad,
            @RequestParam(required = false) BigDecimal tarifaMin,
            @RequestParam(required = false) BigDecimal tarifaMax,
            @RequestParam(required = false) String turno) {
        return ResponseEntity.ok(
                instructorService.buscarInstructoresParaTutor(
                        texto,
                        distrito,
                        especialidad,
                        tarifaMin,
                        tarifaMax,
                        turno));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InstructorResponse> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(instructorService.findById(id));
    }

    @PostMapping
    public ResponseEntity<InstructorResponse> create(@Valid @RequestBody InstructorRequest request) {
        return ResponseEntity.ok(instructorService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InstructorResponse> update(
            @PathVariable Integer id,
            @Valid @RequestBody InstructorRequest request) {
        return ResponseEntity.ok(instructorService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        instructorService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{idInstructor}/perfil/resumen")
    public ResponseEntity<InstructorPerfilResumenDto> obtenerPerfilResumen(
            @PathVariable Integer idInstructor) {
        return ResponseEntity.ok(instructorService.obtenerPerfilResumen(idInstructor));
    }

    @GetMapping("/{idInstructor}/perfil/sedes")
    public ResponseEntity<List<InstructorPerfilSedeDto>> obtenerPerfilSedes(
            @PathVariable Integer idInstructor) {
        return ResponseEntity.ok(instructorService.obtenerPerfilSedes(idInstructor));
    }

    @GetMapping("/{idInstructor}/perfil/servicios")
    public ResponseEntity<List<InstructorPerfilServicioDto>> obtenerPerfilServicios(
            @PathVariable Integer idInstructor) {
        return ResponseEntity.ok(instructorService.obtenerPerfilServicios(idInstructor));
    }

    @GetMapping("/{idInstructor}/perfil/calificaciones")
    public ResponseEntity<List<InstructorPerfilCalificacionDto>> obtenerPerfilCalificaciones(
            @PathVariable Integer idInstructor) {
        return ResponseEntity.ok(instructorService.obtenerPerfilCalificaciones(idInstructor));
    }

}