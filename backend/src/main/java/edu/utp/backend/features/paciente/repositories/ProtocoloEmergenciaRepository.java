package edu.utp.backend.features.paciente.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.utp.backend.features.paciente.entities.ProtocoloEmergencia;

public interface ProtocoloEmergenciaRepository extends JpaRepository<ProtocoloEmergencia, Integer> {
}