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

import edu.utp.backend.entity.ServicioInstructor;
import edu.utp.backend.service.ServicioInstructorService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class ServicioInstructorRestController {

    private final ServicioInstructorService servicioInstructorService;

    @GetMapping("/servicios")
    public ResponseEntity<List<ServicioInstructor>> getAllServicios() {
        return ResponseEntity.ok(servicioInstructorService.findAll());
    }

    @GetMapping("/servicios/{id}")
    public ResponseEntity<ServicioInstructor> getServicioById(@PathVariable Integer id) {
        return ResponseEntity.ok(servicioInstructorService.findById(id));
    }

    @PostMapping("/servicios")
    public ResponseEntity<ServicioInstructor> createServicio(
            @RequestBody ServicioInstructor servicio) {

        return new ResponseEntity<>(
                servicioInstructorService.create(servicio),
                HttpStatus.CREATED);
    }

    @PutMapping(value = "/servicios/{id}", consumes = "application/json")
    public ResponseEntity<ServicioInstructor> updateServicio(
            @PathVariable Integer id,
            @RequestBody ServicioInstructor servicio) {

        return ResponseEntity.ok(
                servicioInstructorService.update(id, servicio));
    }

    @DeleteMapping("/servicios/{id}")
    public ResponseEntity<Void> deleteServicio(@PathVariable Integer id) {
        servicioInstructorService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
}
