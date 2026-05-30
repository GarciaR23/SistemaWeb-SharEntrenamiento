package edu.utp.backend.features.paciente.services;

import java.util.List;

import edu.utp.backend.features.paciente.dtos.PacienteDto;

public interface PacienteService {
    List<PacienteDto> findAll();

    PacienteDto findById(Integer id);

    PacienteDto create(PacienteDto request);

    PacienteDto update(Integer id, PacienteDto request);

    void delete(Integer id);
}