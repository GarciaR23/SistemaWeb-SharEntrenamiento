package edu.utp.backend.features.documento.dtos;

import java.util.List;

public record InstructorModalDto(
        Long idInstructor,
        List<DocumentoDto> documentos) {
}