package edu.utp.backend.features.auth.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import edu.utp.backend.core.security.jwt.services.JwtService;
import edu.utp.backend.features.auth.dtos.LoginRequest;
import edu.utp.backend.features.auth.dtos.LoginResponse;
import edu.utp.backend.features.auth.dtos.RegisterRequest;
import edu.utp.backend.features.auth.dtos.UsuarioResponse;
import edu.utp.backend.features.auth.usuario.entities.Usuario;
import edu.utp.backend.features.auth.usuario.enums.EstadoCuenta;
import edu.utp.backend.features.auth.usuario.enums.Rol;
import edu.utp.backend.features.auth.usuario.repositories.UsuarioRepository;
import edu.utp.backend.features.auth.usuario.services.CorreoService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final CorreoService correoService;
    private final JwtService jwtService;

    @Override
    public LoginResponse login(LoginRequest request) {
        return usuarioRepository.findByEmail(request.email())
                .filter(usuario -> passwordEncoder.matches(request.clave(), usuario.getClave()))
                .map(usuario -> {
                    if (usuario.getEstadoCuenta() != EstadoCuenta.activo) {
                        return new LoginResponse(false, "Cuenta pendiente de validación", null, null);
                    }
                    String token = jwtService.GenerarToken(usuario);
                    return new LoginResponse(true, "Autenticación exitosa", token, toResponse(usuario));
                })
                .orElse(new LoginResponse(false, "Credenciales inválidas", null, null));
    }

    @Override
    @Transactional
    public LoginResponse register(RegisterRequest request) {
        usuarioRepository.findByEmail(request.email()).ifPresent(usuario -> {
            throw new IllegalArgumentException("Ya existe un usuario con ese correo");
        });

        Usuario usuario = new Usuario();
        usuario.setEmail(request.email());
        usuario.setClave(passwordEncoder.encode(request.clave()));
        usuario.setRol(Rol.valueOf(request.rol().toLowerCase()));
        usuario.setEstadoCuenta(EstadoCuenta.pendiente_validacion);

        Usuario saved = usuarioRepository.save(usuario);

        try {
            correoService.enviarCorreoBienvenida(saved.getEmail(), buildDisplayName(saved.getEmail()));
        } catch (Exception ex) {
            LOGGER.warn("No se pudo enviar el correo de bienvenida a {}: {}", saved.getEmail(), ex.getMessage());
        }

        String token = jwtService.GenerarToken(saved);
        return new LoginResponse(true, "Usuario registrado correctamente", token, toResponse(saved));
    }

    private String buildDisplayName(String email) {
        int atIndex = email.indexOf('@');
        if (atIndex <= 0) {
            return email;
        }

        return email.substring(0, atIndex);
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