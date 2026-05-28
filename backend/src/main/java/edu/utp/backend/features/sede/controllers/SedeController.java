package edu.utp.backend.features.sede.controllers;

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

import edu.utp.backend.features.sede.dtos.SedeDto;
import edu.utp.backend.features.sede.services.SedeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/sedes")
@RequiredArgsConstructor
public class SedeController {

    private final SedeService sedeService;

    @GetMapping
    public ResponseEntity<List<SedeDto>> findAll() {
        return ResponseEntity.ok(sedeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SedeDto> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(sedeService.findById(id));
    }

    @PostMapping
    public ResponseEntity<SedeDto> create(@Valid @RequestBody SedeDto request) {
        return ResponseEntity.ok(sedeService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SedeDto> update(@PathVariable Integer id, @Valid @RequestBody SedeDto request) {
        return ResponseEntity.ok(sedeService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        sedeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}