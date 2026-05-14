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

import edu.utp.backend.entity.Instructor;
import edu.utp.backend.service.InstructorService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class InstructorRestController {

    private final InstructorService instructorService;

    @GetMapping("/instructores")
    public ResponseEntity<List<Instructor>> getAllInstructores() {
        return ResponseEntity.ok(instructorService.findAll());
    }

    @GetMapping("/instructores/{id}")
    public ResponseEntity<Instructor> getInstructorById(@PathVariable Integer id) {
        return ResponseEntity.ok(instructorService.findById(id));
    }

    @PostMapping("/instructores")
    public ResponseEntity<Instructor> createInstructor(@RequestBody Instructor instructor) {
        return new ResponseEntity<>(
                instructorService.create(instructor),
                HttpStatus.CREATED);
    }

    @PutMapping(value = "/instructores/{id}", consumes = "application/json")
    public ResponseEntity<Instructor> updateInstructor(
            @PathVariable Integer id,
            @RequestBody Instructor instructor) {

        return ResponseEntity.ok(
                instructorService.update(id, instructor));
    }

    @DeleteMapping("/instructores/{id}")
    public ResponseEntity<Void> deleteInstructor(@PathVariable Integer id) {
        instructorService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
}
