package edu.utp.backend.features.servicio.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.utp.backend.features.servicio.entities.ServicioInstructor;

public interface ServicioInstructorRepository extends JpaRepository<ServicioInstructor, Integer> {
}