package edu.utp.backend.features.documento.services;

import java.util.List;

import edu.utp.backend.features.documento.dtos.DocumentoDto;

public interface DocumentoService {
    List<DocumentoDto> findAll();

    DocumentoDto findById(Long id);

    DocumentoDto create(DocumentoDto request);

    DocumentoDto update(Long id, DocumentoDto request);

    void delete(Long id);
}