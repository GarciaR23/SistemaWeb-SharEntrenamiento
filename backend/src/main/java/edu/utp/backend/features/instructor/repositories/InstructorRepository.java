package edu.utp.backend.features.instructor.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.utp.backend.features.instructor.entities.Instructor;

public interface InstructorRepository extends JpaRepository<Instructor, Integer> {
    Optional<Instructor> findByIdUsuario(Long idUsuario);
}