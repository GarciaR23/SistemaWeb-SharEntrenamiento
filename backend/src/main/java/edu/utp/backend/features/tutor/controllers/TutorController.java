package edu.utp.backend.features.tutor.controllers;

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
import edu.utp.backend.features.tutor.repositories.TutorRepository;
import edu.utp.backend.features.tutor.entities.Tutor;
import edu.utp.backend.features.tutor.dtos.TutorDto;
import edu.utp.backend.features.tutor.services.TutorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tutores")
@RequiredArgsConstructor
public class TutorController {

    private final TutorService tutorService;

    @GetMapping
    public ResponseEntity<List<TutorDto>> findAll() {
        return ResponseEntity.ok(tutorService.findAll());
    }

    private final TutorRepository tutorRepository;

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<TutorDto> findByIdUsuario(@PathVariable Long idUsuario) {
        Tutor tutor = tutorRepository.findByIdUsuario(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Tutor no encontrado para el usuario: " + idUsuario));

        TutorDto response = new TutorDto(
                tutor.getIdTutor(),
                tutor.getIdUsuario(),
                tutor.getNombreCompleto());

        return ResponseEntity.ok(response);
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