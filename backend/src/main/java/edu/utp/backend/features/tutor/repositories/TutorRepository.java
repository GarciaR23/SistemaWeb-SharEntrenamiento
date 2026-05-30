package edu.utp.backend.features.tutor.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.utp.backend.features.tutor.entities.Tutor;

public interface TutorRepository extends JpaRepository<Tutor, Integer> {
}