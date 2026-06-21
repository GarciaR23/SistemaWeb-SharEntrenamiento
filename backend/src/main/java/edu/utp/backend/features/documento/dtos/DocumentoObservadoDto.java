package edu.utp.backend.features.documento.dtos;

import java.time.ZonedDateTime;

public record DocumentoObservadoDto(
    Long idDocumento,
    String nombreDocumento,
    String urlArchivo,
    String estadoAprobacion,
    String comentarioAdmin,
    ZonedDateTime fechaRespuesta) {

}
