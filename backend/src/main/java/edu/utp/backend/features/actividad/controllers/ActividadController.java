package edu.utp.backend.features.actividad.controllers;

import edu.utp.backend.features.actividad.dtos.*;
import edu.utp.backend.features.actividad.services.ActividadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/actividad")
@RequiredArgsConstructor
public class ActividadController {

        private final ActividadService actividadService;

        @GetMapping("/tutor/{idTutor}")
        public ResponseEntity<?> listarPorTutor(
                        @PathVariable Integer idTutor) {
                return ResponseEntity.ok(
                                actividadService.listarPorTutor(idTutor));
        }

        @PostMapping("/detalle/{idDetalle}/iniciar")
        public ResponseEntity<?> iniciarActividad(
                        @PathVariable Integer idDetalle,
                        @Valid @RequestBody ValidarPinRequest request) {
                try {
                        return ResponseEntity.ok(
                                        actividadService.iniciarActividad(
                                                        idDetalle,
                                                        request.pin()));
                } catch (IllegalArgumentException | IllegalStateException ex) {
                        return ResponseEntity.badRequest().body(
                                        Map.of(
                                                        "success", false,
                                                        "message", ex.getMessage()));
                }
        }

        @PostMapping("/sesion/{idSesion}/incidencia")
        public ResponseEntity<?> registrarIncidencia(
                        @PathVariable Integer idSesion,
                        @Valid @RequestBody IncidenciaActividadRequest request) {
                try {
                        return ResponseEntity.ok(
                                        actividadService.registrarIncidencia(
                                                        idSesion,
                                                        request));
                } catch (IllegalArgumentException | IllegalStateException ex) {
                        return ResponseEntity.badRequest().body(
                                        Map.of(
                                                        "success", false,
                                                        "message", ex.getMessage()));
                }
        }

        @PostMapping("/detalle/{idDetalle}/pago")
        public ResponseEntity<?> confirmarPago(
                        @PathVariable Integer idDetalle,
                        @Valid @RequestBody PagoActividadRequest request) {
                try {
                        return ResponseEntity.ok(
                                        actividadService.confirmarPago(
                                                        idDetalle,
                                                        request));
                } catch (IllegalArgumentException | IllegalStateException ex) {
                        return ResponseEntity.badRequest().body(
                                        Map.of(
                                                        "success", false,
                                                        "message", ex.getMessage()));
                }
        }

        @PutMapping("/detalle/{idDetalle}/reprogramacion/aceptar")
        public ResponseEntity<?> aceptarReprogramacion(
                        @PathVariable Integer idDetalle,
                        @Valid @RequestBody AceptarReprogramacionRequest request) {
                try {
                        return ResponseEntity.ok(
                                        actividadService.aceptarReprogramacion(
                                                        idDetalle,
                                                        request));
                } catch (IllegalArgumentException | IllegalStateException ex) {
                        return ResponseEntity.badRequest().body(
                                        Map.of(
                                                        "success", false,
                                                        "message", ex.getMessage()));
                }
        }

        @GetMapping("/reserva/{idReserva}/reporte")
        public ResponseEntity<?> obtenerReporte(
                        @PathVariable Integer idReserva) {
                try {
                        return ResponseEntity.ok(
                                        actividadService.obtenerReportePorReserva(idReserva));
                } catch (IllegalStateException ex) {
                        return ResponseEntity.badRequest().body(
                                        Map.of(
                                                        "success", false,
                                                        "message", ex.getMessage()));
                }
        }
}