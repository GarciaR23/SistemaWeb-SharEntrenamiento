package edu.utp.backend.features.auth.services;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.utp.backend.features.usuario.entities.Usuario;
import edu.utp.backend.features.usuario.repositories.UsuarioRepository;
import edu.utp.backend.features.usuario.services.CorreoService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PasswordRecoveryService {

    private static final Logger LOGGER = LoggerFactory.getLogger(PasswordRecoveryService.class);
    private static final String TOKEN_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int TOKEN_LENGTH = 4;
    private static final long TOKEN_EXPIRATION_MINUTES = 15;

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final CorreoService correoService;

    private final SecureRandom secureRandom = new SecureRandom();
    private final Map<String, RecoveryToken> tokenStore = new ConcurrentHashMap<>();

    public void solicitarRecuperacion(String email) {
        usuarioRepository.findByEmail(email).ifPresent(usuario -> {
            String token = generateToken();
            Instant expiration = Instant.now().plus(TOKEN_EXPIRATION_MINUTES, ChronoUnit.MINUTES);
            tokenStore.put(email.toLowerCase(), new RecoveryToken(token, expiration));

            String nombre = extractName(usuario.getEmail());
            try {
                correoService.enviarCorreoRecuperacionClave(usuario.getEmail(), nombre, token);
            } catch (Exception ex) {
                LOGGER.warn("No se pudo enviar correo de recuperación a {}: {}", email, ex.getMessage());
            }
        });
    }

    public boolean verificarToken(String email, String token) {
        RecoveryToken recoveryToken = tokenStore.get(email.toLowerCase());
        if (recoveryToken == null) {
            return false;
        }

        if (Instant.now().isAfter(recoveryToken.expiresAt())) {
            tokenStore.remove(email.toLowerCase());
            return false;
        }

        return recoveryToken.token().equalsIgnoreCase(token.trim());
    }

    @Transactional
    public boolean restablecerClave(String email, String token, String nuevaClave) {
        if (!verificarToken(email, token)) {
            return false;
        }

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        usuario.setClave(passwordEncoder.encode(nuevaClave));
        usuarioRepository.save(usuario);
        tokenStore.remove(email.toLowerCase());

        try {
            correoService.enviarCorreoCambioClaveExitoso(usuario.getEmail(), extractName(usuario.getEmail()));
        } catch (Exception ex) {
            LOGGER.warn("No se pudo enviar correo de confirmación a {}: {}", email, ex.getMessage());
        }

        return true;
    }

    private String generateToken() {
        StringBuilder token = new StringBuilder(TOKEN_LENGTH);
        for (int i = 0; i < TOKEN_LENGTH; i++) {
            int idx = secureRandom.nextInt(TOKEN_CHARS.length());
            token.append(TOKEN_CHARS.charAt(idx));
        }
        return token.toString();
    }

    private String extractName(String email) {
        int atIndex = email.indexOf('@');
        return atIndex > 0 ? email.substring(0, atIndex) : email;
    }

    private record RecoveryToken(String token, Instant expiresAt) {
    }
}
