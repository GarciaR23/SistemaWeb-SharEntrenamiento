package edu.utp.backend.core.infra.cloudinary;

public record CloudinaryUploadResponse(
        String url,
        String publicId,
        String resourceType,
        String originalFilename) {
}