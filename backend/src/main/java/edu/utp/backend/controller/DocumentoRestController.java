package edu.utp.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.utp.backend.entity.Documento;
import edu.utp.backend.service.DocumentoService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class DocumentoRestController {

    private final DocumentoService documentoService;

    @GetMapping("/documentos")
    public ResponseEntity<List<Documento>> getAllDocumentos() {
        return ResponseEntity.ok(documentoService.findAll());
    }

    @GetMapping("/documentos/{id}")
    public ResponseEntity<Documento> getDocumentoById(@PathVariable Integer id) {
        return ResponseEntity.ok(documentoService.findById(id));
    }

    @PostMapping("/documentos")
    public ResponseEntity<Documento> createDocumento(@RequestBody Documento documento) {
        return new ResponseEntity<>(
                documentoService.create(documento),
                HttpStatus.CREATED);
    }

    @PutMapping(value = "/documentos/{id}", consumes = "application/json")
    public ResponseEntity<Documento> updateDocumento(
            @PathVariable Integer id,
            @RequestBody Documento documento) {

        return ResponseEntity.ok(
                documentoService.update(id, documento));
    }

    @DeleteMapping("/documentos/{id}")
    public ResponseEntity<Void> deleteDocumento(@PathVariable Integer id) {
        documentoService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
}
