package edu.utp.backend.features.notificacion.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.utp.backend.features.notificacion.dtos.NotificacionesResponse;
import edu.utp.backend.features.notificacion.services.NotificacionService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notificaciones")
@RequiredArgsConstructor
public class NotificacionController {

    private final NotificacionService notificacionService;

    @GetMapping("/admin")
    public ResponseEntity<NotificacionesResponse> obtenerNotificacionesAdmin() {
        return ResponseEntity.ok(notificacionService.obtenerNotificacionesAdmin());
    }

    @GetMapping("/instructor/{idInstructor}")
    public ResponseEntity<NotificacionesResponse> obtenerNotificacionesInstructor(
            @PathVariable Integer idInstructor) {
        return ResponseEntity.ok(notificacionService.obtenerNotificacionesInstructor(idInstructor));
    }

    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<NotificacionesResponse> obtenerNotificacionesPaciente(
            @PathVariable Integer idPaciente) {
        return ResponseEntity.ok(notificacionService.obtenerNotificacionesPaciente(idPaciente));
    }
}