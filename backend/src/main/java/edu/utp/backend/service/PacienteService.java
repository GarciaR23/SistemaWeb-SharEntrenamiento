package edu.utp.backend.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import edu.utp.backend.entity.Paciente;
import edu.utp.backend.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PacienteService {

    private final PacienteRepository repository;

    public List<Paciente> findAll() {
        return repository.findAll();
    }

    public Paciente findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Id de paciente no encontrado"));
    }

    public Paciente create(Paciente paciente) {
        if (paciente.getIdPaciente() != null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "El ID de paciente ya fue asignado");
        }

        return repository.save(paciente);
    }

    public void delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Id de paciente no encontrado");
        }
        repository.deleteById(id);
    }
}
