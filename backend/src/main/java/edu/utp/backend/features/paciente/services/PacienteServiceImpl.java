package edu.utp.backend.features.paciente.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.utp.backend.features.paciente.dtos.PacienteDto;
import edu.utp.backend.features.paciente.entities.Paciente;
import edu.utp.backend.features.paciente.repositories.PacienteRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PacienteServiceImpl implements PacienteService {

    private final PacienteRepository pacienteRepository;

    @Override
    public List<PacienteDto> findAll() {
        return pacienteRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    public PacienteDto findById(Integer id) {
        return pacienteRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Paciente no encontrado: " + id));
    }

    @Override
    @Transactional
    public PacienteDto create(PacienteDto request) {
        Paciente paciente = new Paciente();
        apply(paciente, request);
        return toDto(pacienteRepository.save(paciente));
    }

    @Override
    @Transactional
    public PacienteDto update(Integer id, PacienteDto request) {
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Paciente no encontrado: " + id));
        apply(paciente, request);
        return toDto(pacienteRepository.save(paciente));
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        pacienteRepository.deleteById(id);
    }

    private void apply(Paciente paciente, PacienteDto request) {
        paciente.setIdTutor(request.idTutor());
        paciente.setNombreCompleto(request.nombreCompleto());
        paciente.setUrlImagenPaciente(request.urlImagenPaciente());
        paciente.setCondicion(request.condicion());
        paciente.setGradoAutismo(request.gradoAutismo());
        paciente.setGenero(request.genero());
        paciente.setEdad(request.edad());
        paciente.setDistrito(request.distrito());
        paciente.setDireccion(request.direccion());
    }

    private PacienteDto toDto(Paciente paciente) {
        return new PacienteDto(
                paciente.getIdPaciente(),
                paciente.getIdTutor(),
                paciente.getNombreCompleto(),
                paciente.getUrlImagenPaciente(),
                paciente.getCondicion(),
                paciente.getGradoAutismo(),
                paciente.getGenero(),
                paciente.getEdad(),
                paciente.getDistrito(),
                paciente.getDireccion());
    }
}