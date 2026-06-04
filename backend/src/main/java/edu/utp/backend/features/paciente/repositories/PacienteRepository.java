package edu.utp.backend.features.paciente.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.utp.backend.features.paciente.entities.Paciente;

public interface PacienteRepository extends JpaRepository<Paciente, Integer> {
    List<Paciente> findByIdTutor(Integer idTutor);
}