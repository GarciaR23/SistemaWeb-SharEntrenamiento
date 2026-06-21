package edu.utp.backend.features.documento.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.utp.backend.features.documento.dtos.DocumentoCorreccionRequest;
import edu.utp.backend.features.documento.dtos.DocumentoObservadoDto;
import edu.utp.backend.features.documento.dtos.DocumentoDto;
import edu.utp.backend.features.documento.dtos.InstructorModalDto;
import edu.utp.backend.features.documento.services.DocumentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/documentos")
@RequiredArgsConstructor
public class DocumentoController {

    private final DocumentoService documentoService;

    @GetMapping
    public ResponseEntity<List<DocumentoDto>> findAll() {
        return ResponseEntity.ok(documentoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentoDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(documentoService.findById(id));
    }

    @GetMapping("/instructor/{idInstructor}/modal")
    public ResponseEntity<InstructorModalDto> getDocumentosParaModal(
            @PathVariable Long idInstructor) {                                                                                                   
        return ResponseEntity.ok(documentoService.obtenerDocumentosParaModal(idInstructor));
    }

    @GetMapping("/instructor/{idInstructor}/observados")
    public ResponseEntity<List<DocumentoObservadoDto>> getDocumentosObservados(
            @PathVariable Long idInstructor) {
        return ResponseEntity.ok(documentoService.obtenerDocumentosObservados(idInstructor));
    }

    @PostMapping
    public ResponseEntity<DocumentoDto> create(@Valid @RequestBody DocumentoDto request) {
        return ResponseEntity.ok(documentoService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DocumentoDto> update(@PathVariable Long id, @Valid @RequestBody DocumentoDto request) {
        return ResponseEntity.ok(documentoService.update(id, request));
    }

    @PutMapping("/{idDocumento}/corregir")
    public ResponseEntity<DocumentoDto> corregirDocumento(
            @PathVariable Long idDocumento,
            @RequestBody DocumentoCorreccionRequest request) {
        return ResponseEntity.ok(documentoService.corregirDocumento(idDocumento, request));
    }

    @PostMapping("/instructor/{idInstructor}/finalizar-correccion")
    public ResponseEntity<Map<String, String>> finalizarCorreccion(
            @PathVariable Long idInstructor) {
        documentoService.finalizarCorreccionInstructor(idInstructor);
        return ResponseEntity.ok(Map.of("mensaje", "Corrección enviada correctamente."));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        documentoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}