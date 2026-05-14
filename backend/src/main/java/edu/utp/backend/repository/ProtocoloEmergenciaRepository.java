package edu.utp.backend.repository;

import edu.utp.backend.entity.ProtocoloEmergencia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProtocoloEmergenciaRepository extends JpaRepository<ProtocoloEmergencia, Integer> {
}