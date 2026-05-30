package edu.utp.backend.features.documento.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.utp.backend.features.documento.dtos.DocumentoDto;
import edu.utp.backend.features.documento.entities.Documento;
import edu.utp.backend.features.documento.repositories.DocumentoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocumentoServiceImpl implements DocumentoService {

    private final DocumentoRepository documentoRepository;

    @Override
    public List<DocumentoDto> findAll() {
        return documentoRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    public DocumentoDto findById(Long id) {
        return documentoRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Documento no encontrado: " + id));
    }

    @Override
    @Transactional
    public DocumentoDto create(DocumentoDto request) {
        Documento documento = new Documento();
        apply(documento, request);
        return toDto(documentoRepository.save(documento));
    }

    @Override
    @Transactional
    public DocumentoDto update(Long id, DocumentoDto request) {
        Documento documento = documentoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Documento no encontrado: " + id));
        apply(documento, request);
        return toDto(documentoRepository.save(documento));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        documentoRepository.deleteById(id);
    }

    private void apply(Documento documento, DocumentoDto request) {
        documento.setIdInstructor(request.idInstructor());
        documento.setNombreDocumento(request.nombreDocumento());
        documento.setUrlArchivo(request.urlArchivo());
        documento.setEstadoAprobacion(request.estadoAprobacion());
    }

    private DocumentoDto toDto(Documento documento) {
        return new DocumentoDto(
                documento.getIdDocumento(),
                documento.getIdInstructor(),
                documento.getNombreDocumento(),
                documento.getUrlArchivo(),
                documento.getEstadoAprobacion(),
                documento.getFechaSubida());
    }
}