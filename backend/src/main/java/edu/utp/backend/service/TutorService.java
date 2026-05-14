package edu.utp.backend.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import edu.utp.backend.entity.Tutor;
import edu.utp.backend.repository.TutorRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TutorService {

    private final TutorRepository repository;

    public List<Tutor> findAll() {
        return repository.findAll();
    }

    public Tutor findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Id de tutor no encontrado"));
    }

    public Tutor create(Tutor tutor) {
        if (tutor.getIdTutor() != null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "El ID de tutor ya fue asignado");
        }

        return repository.save(tutor);
    }

    public Tutor update(Integer id, Tutor tutor) {
        Tutor aux = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Id de tutor no encontrado"));

        aux.setNombre(tutor.getNombre());
        aux.setUsuario(tutor.getUsuario());

        return repository.save(aux);
    }

    public void delete(Integer id) {
        Tutor aux = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Id de tutor no encontrado"));

        repository.deleteById(aux.getIdTutor());
    }
}
