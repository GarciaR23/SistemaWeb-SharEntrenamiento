package edu.utp.backend.features.servicio.controllers;

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

import edu.utp.backend.features.servicio.dtos.ServicioInstructorDto;
import edu.utp.backend.features.servicio.services.ServicioInstructorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/servicios")
@RequiredArgsConstructor
public class ServicioInstructorController {

    private final ServicioInstructorService servicioInstructorService;

    @GetMapping
    public ResponseEntity<List<ServicioInstructorDto>> findAll() {
        return ResponseEntity.ok(servicioInstructorService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServicioInstructorDto> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(servicioInstructorService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ServicioInstructorDto> create(@Valid @RequestBody ServicioInstructorDto request) {
        return ResponseEntity.ok(servicioInstructorService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServicioInstructorDto> update(@PathVariable Integer id, @Valid @RequestBody ServicioInstructorDto request) {
        return ResponseEntity.ok(servicioInstructorService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        servicioInstructorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}