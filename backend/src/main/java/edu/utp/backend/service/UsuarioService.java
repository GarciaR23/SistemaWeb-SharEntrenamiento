package edu.utp.backend.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import edu.utp.backend.entity.Usuario;
import edu.utp.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    private final UsuarioRepository repository;

    public List<Usuario> findAll() {
        return repository.findAll();
    }

    public Usuario findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Id de usuario no encontrado"));
    }

    public Usuario create(Usuario usuario) {
        if (usuario.getId() != null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "El ID de usuario ya fue asignado");
        }
        validarRol(usuario.getRol());
        return repository.save(usuario);
    }

    public Usuario update(Integer id, Usuario usuario) {
        Usuario aux = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Id de usuario no encontrado"));

        validarRol(usuario.getRol());
        aux.setEmail(usuario.getEmail());
        aux.setContraseña(usuario.getContraseña());
        aux.setRol(usuario.getRol());
        aux.setEstadoCuenta(usuario.getEstadoCuenta());
        aux.setFechaCreacion(usuario.getFechaCreacion());
        return repository.save(aux);
    }

    public void delete(Integer id) {
        Usuario aux = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Id de usuario no encontrado"));
        repository.deleteById(aux.getId());
    }

    private void validarRol(String rol) {
        if (rol == null ||
                (!rol.equalsIgnoreCase("tutor") && !rol.equalsIgnoreCase("instructor"))) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El rol solo puede ser 'tutor' o 'instructor'");
        }
    }
}
