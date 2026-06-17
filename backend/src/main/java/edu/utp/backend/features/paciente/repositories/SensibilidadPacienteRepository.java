package edu.utp.backend.features.paciente.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.utp.backend.features.paciente.entities.SensibilidadPaciente;

public interface SensibilidadPacienteRepository extends JpaRepository<SensibilidadPaciente, Integer> {
}