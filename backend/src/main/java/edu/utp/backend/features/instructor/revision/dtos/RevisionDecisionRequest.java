package edu.utp.backend.features.instructor.revision.dtos;

import jakarta.validation.constraints.NotNull;

public record RevisionDecisionRequest(
                @NotNull Integer idDetalle,
                @NotNull Boolean aprobada) {
}