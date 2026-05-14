package edu.utp.backend.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import edu.utp.backend.entity.Instructor;
import edu.utp.backend.entity.Usuario;
import edu.utp.backend.repository.InstructorRepository;
import edu.utp.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InstructorService {

    private final InstructorRepository instructorRepository;
    private final UsuarioRepository usuarioRepository;

    //get
    public List<Instructor> findAll() {
        return instructorRepository.findAll();
    }
    //getbyid
    public Instructor findById(Integer id) {
        return instructorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Id de instructor no encontrado"));
    }

    //create
    public Instructor create(Instructor instructor) {

        if (instructor.getIdInstructor() != null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El instructor ya tiene un ID asignado");
        }

        // Validar usuario
        if (instructor.getUsuario() == null ||
            instructor.getUsuario().getId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Debe proporcionar un id_usuario válido");
        }

        Usuario usuario = usuarioRepository
                .findById(instructor.getUsuario().getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuario no encontrado"));

        // Validar que rol sea instructor
        if (!usuario.getRol().equalsIgnoreCase("instructor")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El usuario debe tener rol 'instructor'");
        }

        // Validar relación única
        boolean yaExiste = instructorRepository.findAll().stream()
                .anyMatch(i -> i.getUsuario().getId()
                .equals(usuario.getId()));

        if (yaExiste) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Este usuario ya está registrado como instructor");
        }

        instructor.setUsuario(usuario);

        return instructorRepository.save(instructor);
    }
    //update
    public Instructor update(Integer id, Instructor instructor) {

        Instructor aux = instructorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Id de instructor no encontrado"));

        // Actualizar usuario si viene
        if (instructor.getUsuario() != null &&
            instructor.getUsuario().getId() != null) {

            Usuario usuario = usuarioRepository
                    .findById(instructor.getUsuario().getId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Usuario no encontrado"));

            if (!usuario.getRol().equalsIgnoreCase("instructor")) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "El usuario debe tener rol 'instructor'");
            }

            aux.setUsuario(usuario);
        }

        aux.setNombreCompleto(instructor.getNombreCompleto());
        aux.setEspecialidad(instructor.getEspecialidad());
        aux.setBiografiaInstructor(instructor.getBiografiaInstructor());

        return instructorRepository.save(aux);
    }
    //delete
    public void delete(Integer id) {

        Instructor instructor = instructorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Id de instructor no encontrado"));

        instructorRepository.deleteById(instructor.getIdInstructor());
    }
}
