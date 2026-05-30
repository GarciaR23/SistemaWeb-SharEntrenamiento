package edu.utp.backend.features.auth.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record VerifyTokenRequest(
        @NotBlank @Email String email,
        @NotBlank String token) {
}
