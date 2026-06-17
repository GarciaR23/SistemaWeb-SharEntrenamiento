package edu.utp.backend.features.auth.controllers;

import java.time.ZonedDateTime;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.utp.backend.features.auth.dtos.LoginRequest;
import edu.utp.backend.features.auth.dtos.LoginResponse;
import edu.utp.backend.features.auth.dtos.RegistroInstructorRequest;
import edu.utp.backend.features.auth.dtos.RegistroInstructorResponse;
import edu.utp.backend.core.security.jwt.JwtService;
import edu.utp.backend.features.auth.dtos.ForgotPasswordRequest;
import edu.utp.backend.features.auth.dtos.ResetPasswordRequest;
import edu.utp.backend.features.auth.dtos.VerifyTokenRequest;
import edu.utp.backend.features.auth.services.AuthService;
import edu.utp.backend.features.auth.services.PasswordRecoveryService;
import edu.utp.backend.features.instructor.entities.Instructor;
import edu.utp.backend.features.instructor.repositories.InstructorRepository;
import edu.utp.backend.features.auth.dtos.RegistroTutorRequest;
import edu.utp.backend.features.auth.dtos.RegistroTutorResponse;
import edu.utp.backend.features.tutor.entities.Tutor;
import edu.utp.backend.features.tutor.repositories.TutorRepository;
import edu.utp.backend.features.usuario.dtos.UsuarioResponse;
import edu.utp.backend.features.usuario.entities.Usuario;
import edu.utp.backend.features.usuario.enums.EstadoCuenta;
import edu.utp.backend.features.usuario.enums.Rol;
import edu.utp.backend.features.usuario.repositories.UsuarioRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@Validated
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final PasswordRecoveryService passwordRecoveryService;
    private final UsuarioRepository usuarioRepository;
    private final InstructorRepository instructorRepository;
    private final PasswordEncoder passwordEncoder;
    private final TutorRepository tutorRepository;
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register/instructor")
    @Transactional
    public ResponseEntity<RegistroInstructorResponse> registrarInstructor(
            @Valid @RequestBody RegistroInstructorRequest request) {

        usuarioRepository.findByEmail(request.email()).ifPresent(u -> {
            throw new IllegalArgumentException("Ya existe un usuario con ese correo");
        });

        Usuario usuario = new Usuario();
        usuario.setEmail(request.email());
        usuario.setClave(passwordEncoder.encode(request.clave()));
        usuario.setRol(Rol.instructor);
        usuario.setEstadoCuenta(EstadoCuenta.pendiente_validacion);
        usuario.setFechaRegistro(ZonedDateTime.now());
        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        Instructor instructor = new Instructor();
        instructor.setIdUsuario(usuarioGuardado.getIdUsuario());
        instructor.setNombreCompleto(request.nombreCompleto());
        instructor.setUrlImagenPerfil(request.urlImagenPerfil());
        instructor.setEspecialidad(request.especialidad());
        instructor.setBiografia(request.biografia());
        instructor.setDistrito(request.distrito());
        instructor.setDireccion(request.direccion());
        Instructor instructorGuardado = instructorRepository.save(instructor);

        UsuarioResponse usuarioResponse = new UsuarioResponse(
                usuarioGuardado.getIdUsuario(),
                usuarioGuardado.getEmail(),
                usuarioGuardado.getRol(),
                usuarioGuardado.getEstadoCuenta(),
                usuarioGuardado.getFechaRegistro());

        return ResponseEntity.ok(new RegistroInstructorResponse(
                true, "Registro exitoso", usuarioResponse, instructorGuardado.getIdInstructor()));
    }

    @PostMapping("/register/tutor")
    @Transactional
    public ResponseEntity<RegistroTutorResponse> registrarTutor(
            @Valid @RequestBody RegistroTutorRequest request) {

        usuarioRepository.findByEmail(request.email()).ifPresent(u -> {
            throw new IllegalArgumentException("Ya existe un usuario con ese correo");
        });

        Usuario usuario = new Usuario();
        usuario.setEmail(request.email());
        usuario.setClave(passwordEncoder.encode(request.clave()));
        usuario.setRol(Rol.tutor);
        usuario.setEstadoCuenta(EstadoCuenta.activo);
        usuario.setFechaRegistro(ZonedDateTime.now());

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        Tutor tutor = new Tutor();
        tutor.setIdUsuario(usuarioGuardado.getIdUsuario());
        tutor.setNombreCompleto(request.nombreCompleto());

        Tutor tutorGuardado = tutorRepository.save(tutor);

        UsuarioResponse usuarioResponse = new UsuarioResponse(
                usuarioGuardado.getIdUsuario(),
                usuarioGuardado.getEmail(),
                usuarioGuardado.getRol(),
                usuarioGuardado.getEstadoCuenta(),
                usuarioGuardado.getFechaRegistro());

        String token = jwtService.GenerarToken(usuarioGuardado);

        return ResponseEntity.ok(new RegistroTutorResponse(
                true,
                "Registro exitoso",
                token,
                usuarioResponse,
                tutorGuardado.getIdTutor()));
    }

    @PostMapping("/password/forgot")
    public ResponseEntity<Map<String, Object>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        passwordRecoveryService.solicitarRecuperacion(request.email());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Si el correo existe, se envio un token de recuperacion"));
    }

    @PostMapping("/password/verify-token")
    public ResponseEntity<Map<String, Object>> verifyToken(@Valid @RequestBody VerifyTokenRequest request) {
        boolean valid = passwordRecoveryService.verificarToken(request.email(), request.token());
        if (!valid) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Token invalido o expirado"));
        }
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Token valido"));
    }

    @PostMapping("/password/reset")
    public ResponseEntity<Map<String, Object>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        boolean changed = passwordRecoveryService.restablecerClave(request.email(), request.token(),
                request.nuevaClave());
        if (!changed) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "No se pudo restablecer la contrasena"));
        }
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Contrasena actualizada correctamente"));
    }
}