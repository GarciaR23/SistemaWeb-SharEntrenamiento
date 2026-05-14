package edu.utp.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.utp.backend.entity.ProtocoloEmergencia;
import edu.utp.backend.service.ProtocoloEmergenciaService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/protocolos")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class ProtocoloEmergenciaRestController {

    private final ProtocoloEmergenciaService protocoloEmergenciaService;

    @GetMapping
    public ResponseEntity<List<ProtocoloEmergencia>> getAll() {
        return ResponseEntity.ok(protocoloEmergenciaService.findAll());
    }

    @PostMapping
    public ResponseEntity<ProtocoloEmergencia> create(@RequestBody ProtocoloEmergencia protocolo) {
        return new ResponseEntity<>(protocoloEmergenciaService.create(protocolo), HttpStatus.CREATED);
    }
}
