package edu.utp.backend.features.auth.controllers;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.utp.backend.features.auth.dtos.LoginRequest;
import edu.utp.backend.features.auth.dtos.LoginResponse;
import edu.utp.backend.features.auth.dtos.ForgotPasswordRequest;
import edu.utp.backend.features.auth.dtos.RegisterRequest;
import edu.utp.backend.features.auth.dtos.ResetPasswordRequest;
import edu.utp.backend.features.auth.dtos.VerifyTokenRequest;
import edu.utp.backend.features.auth.services.AuthService;
import edu.utp.backend.features.auth.services.PasswordRecoveryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@Validated
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final PasswordRecoveryService passwordRecoveryService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
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
        boolean changed = passwordRecoveryService.restablecerClave(request.email(), request.token(), request.nuevaClave());
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