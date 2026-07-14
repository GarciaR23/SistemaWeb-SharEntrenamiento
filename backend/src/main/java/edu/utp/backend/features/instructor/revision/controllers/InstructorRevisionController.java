package edu.utp.backend.features.instructor.revision.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.utp.backend.features.instructor.revision.dtos.ContadorPendienteDto;
import edu.utp.backend.features.instructor.revision.dtos.FechaCriticaDto;
import edu.utp.backend.features.instructor.revision.dtos.RecienteSemanalDto;
import edu.utp.backend.features.instructor.revision.dtos.RevisionDecisionRequest;
import edu.utp.backend.features.instructor.revision.dtos.RevisionDecisionResponse;
import edu.utp.backend.features.instructor.revision.dtos.RevisionPacienteDto;
import edu.utp.backend.features.instructor.revision.services.RevisionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/instructores/revision")
@RequiredArgsConstructor
public class InstructorRevisionController {

    private final RevisionService revisionService;

    @GetMapping("/pacientes/{idInstructor}")
    public ResponseEntity<List<RevisionPacienteDto>> obtenerPacientesParaRevision(
            @PathVariable Integer idInstructor) {
        return ResponseEntity.ok(revisionService.obtenerPacientesParaRevision(idInstructor));
    }

    @GetMapping("/fecha-critica/{idReserva}")
    public ResponseEntity<FechaCriticaDto> obtenerFechaCritica(
            @PathVariable Integer idReserva) {
        return ResponseEntity.ok(revisionService.obtenerFechaCritica(idReserva));
    }

    @PutMapping("/decidir")
    public ResponseEntity<RevisionDecisionResponse> decidirRevision(
            @Valid @RequestBody RevisionDecisionRequest request) {
        return ResponseEntity.ok(revisionService.decidirRevision(request));
    }

    @GetMapping("/contador-pendiente/{idInstructor}")
    public ResponseEntity<ContadorPendienteDto> obtenerContadorPendiente(
            @PathVariable Integer idInstructor) {
        return ResponseEntity.ok(revisionService.obtenerContadorPendiente(idInstructor));
    }

    @GetMapping("/reciente-semanal/{idInstructor}")
    public ResponseEntity<List<RecienteSemanalDto>> obtenerRecienteSemanal(
            @PathVariable Integer idInstructor) {
        return ResponseEntity.ok(revisionService.obtenerRecienteSemanal(idInstructor));
    }

    @PostMapping("/limpiar-vencidas")
    public ResponseEntity<Void> limpiarVencidas() {
        revisionService.limpiarVencidas();
        return ResponseEntity.ok().build();
    }
}