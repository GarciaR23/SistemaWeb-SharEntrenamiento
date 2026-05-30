package edu.utp.backend.features.documento.dtos;

import java.time.OffsetDateTime;

public record DocumentoDto(
        Long idDocumento,
        Long idInstructor,
        String nombreDocumento,
        String urlArchivo,
        String estadoAprobacion,
        OffsetDateTime fechaSubida) {
}