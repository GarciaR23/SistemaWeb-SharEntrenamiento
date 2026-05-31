package edu.utp.backend.features.documento.services;

import java.util.List;

import edu.utp.backend.features.documento.dtos.DocumentoDto;
import edu.utp.backend.features.documento.dtos.InstructorModalDto;

public interface DocumentoService {
    List<DocumentoDto> findAll();

    DocumentoDto findById(Long id);

    DocumentoDto create(DocumentoDto request);

    DocumentoDto update(Long id, DocumentoDto request);

    InstructorModalDto obtenerDocumentosParaModal(Long idInstructor);

    void delete(Long id);
}