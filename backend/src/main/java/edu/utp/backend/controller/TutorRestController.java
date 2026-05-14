package edu.utp.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.utp.backend.entity.Tutor;
import edu.utp.backend.service.TutorService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class TutorRestController {

    private final TutorService tutorService;

    @GetMapping("/tutores")
    public ResponseEntity<List<Tutor>> getAllTutores() {
        return ResponseEntity.ok(tutorService.findAll());
    }

    @GetMapping("/tutores/{id}")
    public ResponseEntity<Tutor> getTutorById(@PathVariable Integer id) {
        return ResponseEntity.ok(tutorService.findById(id));
    }

    @PostMapping("/tutores")
    public ResponseEntity<Tutor> createTutor(@RequestBody Tutor tutor) {
        return new ResponseEntity<>(
                tutorService.create(tutor),
                HttpStatus.CREATED);
    }

    @PutMapping(value = "/tutores/{id}", consumes = "application/json")
    public ResponseEntity<Tutor> updateTutor(
            @PathVariable Integer id,
            @RequestBody Tutor tutor) {

        return ResponseEntity.ok(
                tutorService.update(id, tutor));
    }

    @DeleteMapping("/tutores/{id}")
    public ResponseEntity<Void> deleteTutor(@PathVariable Integer id) {
        tutorService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
}
