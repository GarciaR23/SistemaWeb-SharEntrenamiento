package edu.utp.backend.features.sede.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.utp.backend.features.sede.entities.Sede;

public interface SedeRepository extends JpaRepository<Sede, Integer> {
}