package edu.utp.backend.features.auth.services;

import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import edu.utp.backend.core.security.jwt.JwtService;
import edu.utp.backend.features.auth.dtos.LoginRequest;
import edu.utp.backend.features.auth.dtos.LoginResponse;
import edu.utp.backend.features.instructor.repositories.InstructorRepository;
import edu.utp.backend.features.paciente.entities.Paciente;
import edu.utp.backend.features.paciente.repositories.PacienteRepository;
import edu.utp.backend.features.tutor.repositories.TutorRepository;
import edu.utp.backend.features.usuario.dtos.UsuarioResponse;
import edu.utp.backend.features.usuario.entities.Usuario;
import edu.utp.backend.features.usuario.enums.EstadoCuenta;
import edu.utp.backend.features.usuario.enums.Rol;
import edu.utp.backend.features.usuario.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

        private final UsuarioRepository usuarioRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final InstructorRepository instructorRepository;
        private final TutorRepository tutorRepository;
        private final PacienteRepository pacienteRepository;

        @Override
        public LoginResponse login(LoginRequest request) {
                return usuarioRepository.findByEmail(request.email())
                                .filter(usuario -> passwordEncoder.matches(request.clave(), usuario.getClave()))
                                .map(usuario -> {
                                        if (usuario.getEstadoCuenta() == EstadoCuenta.pendiente_validacion) {
                                                return new LoginResponse(false, "Cuenta pendiente de validación", null,
                                                                null);
                                        }
                                        if (usuario.getEstadoCuenta() == EstadoCuenta.pendiente_subsanacion) {
                                                Long idInstructor = instructorRepository
                                                                .findByIdUsuario(usuario.getIdUsuario())
                                                                .map(i -> i.getIdInstructor().longValue()).orElse(null);
                                                UsuarioResponse u = toResponse(usuario, idInstructor, null, null, null);
                                                return new LoginResponse(false,
                                                                "El administrador ha revisado tus documentos. Tienes observaciones pendientes de subsanar.",
                                                                null, u);
                                        }
                                        if (usuario.getEstadoCuenta() != EstadoCuenta.activo) {
                                                return new LoginResponse(false, "Cuenta suspendida", null, null);
                                        }

                                        usuario.setUltimoLogin(ZonedDateTime.now());
                                        usuarioRepository.save(usuario);

                                        String token = jwtService.GenerarToken(usuario);

                                        Long idInstructor = null;
                                        Long idTutor = null;
                                        Long idPaciente = null;
                                        Long idAdmin = null;

                                        if (usuario.getRol() == Rol.instructor) {
                                                idInstructor = instructorRepository
                                                                .findByIdUsuario(usuario.getIdUsuario())
                                                                .map(i -> i.getIdInstructor().longValue()).orElse(null);
                                        } else if (usuario.getRol() == Rol.tutor) {
                                                idTutor = tutorRepository.findByIdUsuario(usuario.getIdUsuario())
                                                                .map(t -> t.getIdTutor().longValue()).orElse(null);
                                                if (idTutor != null) {
                                                        List<Paciente> pacientes = pacienteRepository
                                                                        .findByIdTutor(idTutor.intValue());
                                                        if (!pacientes.isEmpty()) {
                                                                idPaciente = pacientes.get(0).getIdPaciente()
                                                                                .longValue();
                                                        }
                                                }
                                        } else if (usuario.getRol() == Rol.admin) {
                                                idAdmin = usuario.getIdUsuario();
                                        }

                                        UsuarioResponse usuarioResponse = toResponse(usuario, idInstructor, idTutor,
                                                        idPaciente, idAdmin);
                                        return new LoginResponse(true, "Autenticación exitosa", token, usuarioResponse);
                                })
                                .orElse(new LoginResponse(false, "Credenciales inválidas", null, null));
        }

        private UsuarioResponse toResponse(Usuario usuario, Long idInstructor, Long idTutor, Long idPaciente,
                        Long idAdmin) {
                return new UsuarioResponse(
                                usuario.getIdUsuario(),
                                usuario.getEmail(),
                                usuario.getRol().name(),
                                usuario.getEstadoCuenta().name(),
                                usuario.getFechaRegistro(),
                                idInstructor,
                                idTutor,
                                idPaciente,
                                idAdmin);
        }
}