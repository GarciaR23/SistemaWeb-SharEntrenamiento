package edu.utp.backend.features.auth.services;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import edu.utp.backend.core.security.jwt.services.JwtService;
import edu.utp.backend.features.auth.dtos.LoginRequest;
import edu.utp.backend.features.auth.dtos.LoginResponse;
import edu.utp.backend.features.auth.dtos.UsuarioResponse;
import edu.utp.backend.features.auth.usuario.entities.Usuario;
import edu.utp.backend.features.auth.usuario.enums.EstadoCuenta;
import edu.utp.backend.features.auth.usuario.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
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

    private UsuarioResponse toResponse(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getIdUsuario(),
                usuario.getEmail(),
                usuario.getRol(),
                usuario.getEstadoCuenta(),
                usuario.getFechaRegistro());
    }
}