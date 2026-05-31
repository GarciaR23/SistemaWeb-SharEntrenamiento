package edu.utp.backend.features.auth.services;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.utp.backend.features.auth.dtos.UsuarioRequest;
import edu.utp.backend.features.auth.dtos.UsuarioResponse;
import edu.utp.backend.features.auth.usuario.entities.Usuario;
import edu.utp.backend.features.auth.usuario.enums.EstadoCuenta;
import edu.utp.backend.features.auth.usuario.enums.Rol;
import edu.utp.backend.features.auth.usuario.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<UsuarioResponse> findAll() {
        return usuarioRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public UsuarioResponse findById(Long id) {
        return usuarioRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado: " + id));
    }

    @Override
    @Transactional
    public UsuarioResponse create(UsuarioRequest request) {
        ensureEmailAvailable(request.email(), null);

        Usuario usuario = new Usuario();
        apply(usuario, request);
        return toResponse(usuarioRepository.save(usuario));
    }

    @Override
    @Transactional
    public UsuarioResponse update(Long id, UsuarioRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado: " + id));

        ensureEmailAvailable(request.email(), id);
        apply(usuario, request);
        return toResponse(usuarioRepository.save(usuario));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new IllegalArgumentException("Usuario no encontrado: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    private void ensureEmailAvailable(String email, Long currentId) {
        usuarioRepository.findByEmail(email).ifPresent(usuario -> {
            if (currentId == null || !currentId.equals(usuario.getIdUsuario())) {
                throw new IllegalArgumentException("Ya existe un usuario con ese correo");
            }
        });
    }

    private void apply(Usuario usuario, UsuarioRequest request) {
        usuario.setEmail(request.email());
        usuario.setClave(passwordEncoder.encode(request.clave()));
        usuario.setRol(Rol.valueOf(request.rol().toLowerCase()));
        usuario.setEstadoCuenta(EstadoCuenta.valueOf(request.estadoCuenta().toLowerCase()));
    }

    private UsuarioResponse toResponse(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getIdUsuario(),
                usuario.getEmail(),
                usuario.getRol(),
                usuario.getEstadoCuenta(),
                usuario.getFechaRegistro());
    }
}