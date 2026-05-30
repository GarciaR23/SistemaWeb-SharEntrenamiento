package edu.utp.backend.core.config.Cloudinary;

public record CloudinaryUploadResponse(
        String url,
        String publicId,
        String resourceType,
        String originalFilename) {
}