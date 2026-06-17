package edu.utp.backend.features.paciente.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.utp.backend.features.paciente.entities.ContactoEmergencia;

public interface ContactoEmergenciaRepository extends JpaRepository<ContactoEmergencia, Integer> {
}