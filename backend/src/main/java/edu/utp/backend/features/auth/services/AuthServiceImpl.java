package edu.utp.backend.features.auth.services;

import java.time.ZonedDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import edu.utp.backend.core.security.jwt.JwtService;
import edu.utp.backend.features.auth.dtos.LoginRequest;
import edu.utp.backend.features.auth.dtos.LoginResponse;
import edu.utp.backend.features.instructor.repositories.InstructorRepository;
import edu.utp.backend.features.usuario.dtos.UsuarioResponse;
import edu.utp.backend.features.usuario.entities.Usuario;
import edu.utp.backend.features.usuario.enums.EstadoCuenta;
import edu.utp.backend.features.usuario.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final InstructorRepository instructorRepository;

    @Override
    public LoginResponse login(LoginRequest request) {
        return usuarioRepository.findByEmail(request.email())
                .filter(usuario -> passwordEncoder.matches(request.clave(), usuario.getClave()))
                .map(usuario -> {
                    if (usuario.getEstadoCuenta() == EstadoCuenta.pendiente_validacion) {
                        return new LoginResponse(false, "Cuenta pendiente de validación", null, null, null);
                    }
                    if (usuario.getEstadoCuenta() == EstadoCuenta.pendiente_subsanacion) {
                        Long idInstructor = instructorRepository.findByIdUsuario(usuario.getIdUsuario())
                                .map(i -> i.getIdInstructor().longValue())
                                .orElse(null);
                        return new LoginResponse(false,
                                "El administrador ha revisado tus documentos. Tienes observaciones pendientes de subsanar.",
                                null, null, idInstructor);
                    }

                    if (usuario.getEstadoCuenta() != EstadoCuenta.activo) {
                        return new LoginResponse(false, "Cuenta suspendida", null, null, null);
                    }

                    usuario.setUltimoLogin(ZonedDateTime.now());
                    usuarioRepository.save(usuario);

                    String token = jwtService.GenerarToken(usuario);
                    return new LoginResponse(true, "Autenticación exitosa", token, toResponse(usuario), null);
                })
                .orElse(new LoginResponse(false, "Credenciales inválidas", null, null, null));
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