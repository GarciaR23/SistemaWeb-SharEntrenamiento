package edu.utp.backend.features.usuario.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CorreoService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromAddress;

    @Value("${spring.application.name:backend}")
    private String applicationName;

    public void enviarCorreoBienvenida(String destinatario, String nombreUsuario) {
        String asunto = "Bienvenido a " + applicationName;
        String texto = construirBienvenida(nombreUsuario, destinatario);
        enviarCorreo(destinatario, asunto, texto);
    }

    public void enviarCorreoRecuperacionClave(String destinatario, String nombreUsuario, String token) {
        String asunto = "Recuperación de contraseña";
        String texto = construirRecuperacion(nombreUsuario, token);
        enviarCorreo(destinatario, asunto, texto);
    }

    public void enviarCorreoCambioClaveExitoso(String destinatario, String nombreUsuario) {
        String asunto = "Tu contraseña fue actualizada";
        String texto = construirCambioClave(nombreUsuario);
        enviarCorreo(destinatario, asunto, texto);
    }

    private void enviarCorreo(String destinatario, String asunto, String texto) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(destinatario);
            message.setSubject(asunto);
            message.setText(texto);
            mailSender.send(message);
        } catch (Exception ex) {
            throw new RuntimeException("No se pudo enviar el correo a " + destinatario + ": " + ex.getMessage(), ex);
        }
    }

    private String construirBienvenida(String nombreUsuario, String destinatario) {
        return String.join(System.lineSeparator(),
                "Hola " + nombreUsuario + ',',
                "",
                "Tu cuenta en " + applicationName + " fue creada correctamente.",
                "Usuario: " + destinatario,
                "",
                "Si no solicitaste este registro, ignora este mensaje.",
                "",
                "Saludos,",
                applicationName);
    }

    private String construirRecuperacion(String nombreUsuario, String token) {
        return String.join(System.lineSeparator(),
                "Hola " + nombreUsuario + ',',
                "",
                "Recibimos una solicitud para restablecer tu contraseña.",
                "Tu token de recuperación es: " + token,
                "",
                "Usa ese token solo en el flujo de recuperación del sistema.",
                "Si no solicitaste esto, puedes ignorar este mensaje.",
                "",
                "Saludos,",
                applicationName);
    }

    private String construirCambioClave(String nombreUsuario) {
        return String.join(System.lineSeparator(),
                "Hola " + nombreUsuario + ',',
                "",
                "Tu contraseña fue actualizada correctamente.",
                "Si no realizaste este cambio, revisa tu cuenta de inmediato.",
                "",
                "Saludos,",
                applicationName);
    }
}
