package edu.utp.backend.features.paciente.services;

import java.util.List;

import edu.utp.backend.features.paciente.dtos.ContactoEmergenciaDto;
import edu.utp.backend.features.paciente.dtos.PacienteDto;
import edu.utp.backend.features.paciente.dtos.ProtocoloEmergenciaDto;
import edu.utp.backend.features.paciente.dtos.SensibilidadPacienteDto;

public interface PacienteService {
    List<PacienteDto> findAll();

    List<PacienteDto> findByIdTutor(Integer idTutor);

    PacienteDto findById(Integer id);

    PacienteDto create(PacienteDto request);

    ProtocoloEmergenciaDto crearProtocoloEmergencia(Integer idPaciente, ProtocoloEmergenciaDto request);

    ContactoEmergenciaDto crearContactoEmergencia(Integer idPaciente, ContactoEmergenciaDto request);

    SensibilidadPacienteDto crearSensibilidadPaciente(Integer idPaciente, SensibilidadPacienteDto request);

    PacienteDto update(Integer id, PacienteDto request);

    void delete(Integer id);
}