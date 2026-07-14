package edu.utp.backend.features.instructor.revision.dtos;

import java.time.LocalDateTime;

public record RevisionDecisionResponse(
                Integer idDetalle,
                Integer idReserva,
                String estadoReserva,
                LocalDateTime fechaRevision) {
}