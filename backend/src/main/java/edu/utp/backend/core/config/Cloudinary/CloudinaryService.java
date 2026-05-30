package edu.utp.backend.core.config.Cloudinary;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private static final String IMAGE_MIME_PREFIX = "image/";

    @Autowired(required = false)
    @Qualifier("cloudinary")
    private Object cloudinary;

    public CloudinaryUploadResponse uploadImage(MultipartFile file) {
        return upload(file, "image", "image");
    }

    public CloudinaryUploadResponse uploadFile(MultipartFile file) {
        return upload(file, "raw", "file");
    }

    public void deleteAsset(String publicId, String resourceType) {
        try {
            Object uploader = invoke(cloudinary(), "uploader");
            Map<String, Object> options = new java.util.HashMap<>();
            options.put("resource_type", resourceType);
            Object result = invoke(uploader, "destroy", publicId, options);
            System.out.println("🗑️ Recurso eliminado: " + publicId + " - Resultado: " + result);
        } catch (Exception e) {
            System.err.println("❌ Error al eliminar recurso: " + e.getMessage());
            throw new RuntimeException("Error al eliminar recurso: " + e.getMessage(), e);
        }
    }

    private CloudinaryUploadResponse upload(MultipartFile file, String resourceType, String folderPrefix) {
        try {
            validateFile(file, resourceType);

            String safePublicId = folderPrefix + "_" + sanitizePublicId(file.getOriginalFilename()) + "_"
                    + System.currentTimeMillis();

            Object uploader = invoke(cloudinary(), "uploader");
            Map<String, Object> options = new java.util.HashMap<>();
            options.put("resource_type", resourceType);
            options.put("folder", "sharentrenamiento/" + folderPrefix);
            options.put("public_id", safePublicId);
            options.put("use_filename", true);
            options.put("unique_filename", true);
            options.put("overwrite", false);

            Object uploadResult = invoke(uploader, "upload", file.getBytes(), options);
            Map<?, ?> resultMap = asMap(uploadResult);

            String url = resultMap.get("secure_url").toString();
            String publicId = resultMap.get("public_id").toString();
            String detectedType = resultMap.get("resource_type").toString();

            return new CloudinaryUploadResponse(url, publicId, detectedType, file.getOriginalFilename());
        } catch (IOException e) {
            throw new RuntimeException("No se pudo leer el archivo para subirlo a Cloudinary", e);
        } catch (Exception e) {
            throw new RuntimeException("Error al subir el archivo a Cloudinary", e);
        }
    }

    private Object cloudinary() {
        if (cloudinary == null) {
            throw new IllegalStateException("Cloudinary no está disponible en runtime. Revisa que la dependencia esté cargada en el classpath.");
        }
        return cloudinary;
    }

    private Object invoke(Object target, String methodName, Object... args) throws ReflectiveOperationException {
        Class<?>[] parameterTypes = new Class<?>[args.length];
        for (int i = 0; i < args.length; i++) {
            parameterTypes[i] = args[i].getClass();
            if (args[i] instanceof java.util.HashMap) {
                parameterTypes[i] = Map.class;
            }
            if (args[i] instanceof byte[]) {
                parameterTypes[i] = byte[].class;
            }
        }

        Method method = findMethod(target.getClass(), methodName, parameterTypes);
        if (method == null) {
            throw new NoSuchMethodException(target.getClass().getName() + "." + methodName);
        }
        try {
            return method.invoke(target, args);
        } catch (InvocationTargetException e) {
            Throwable cause = e.getTargetException();
            if (cause instanceof ReflectiveOperationException reflectiveOperationException) {
                throw reflectiveOperationException;
            }
            if (cause instanceof RuntimeException runtimeException) {
                throw runtimeException;
            }
            throw new RuntimeException(cause);
        }
    }

    private Method findMethod(Class<?> type, String methodName, Class<?>[] parameterTypes) {
        for (Method method : type.getMethods()) {
            if (!method.getName().equals(methodName) || method.getParameterCount() != parameterTypes.length) {
                continue;
            }

            Class<?>[] declaredParameterTypes = method.getParameterTypes();
            boolean matches = true;
            for (int i = 0; i < declaredParameterTypes.length; i++) {
                if (!declaredParameterTypes[i].isAssignableFrom(parameterTypes[i])) {
                    matches = false;
                    break;
                }
            }

            if (matches) {
                return method;
            }
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    private Map<?, ?> asMap(Object value) {
        if (value instanceof Map<?, ?> map) {
            return map;
        }

        if (value instanceof MultiValueMap<?, ?> multiValueMap) {
            return (Map<?, ?>) multiValueMap;
        }

        throw new IllegalStateException("Cloudinary no devolvió un mapa de resultados");
    }

    private void validateFile(MultipartFile file, String resourceType) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("El archivo está vacío");
        }

        String contentType = file.getContentType();
        if (contentType == null || contentType.isBlank()) {
            throw new IllegalArgumentException("No se pudo determinar el tipo del archivo");
        }

        if ("image".equals(resourceType) && !contentType.startsWith(IMAGE_MIME_PREFIX)) {
            throw new IllegalArgumentException("El archivo debe ser una imagen");
        }

        if ("raw".equals(resourceType) && contentType.startsWith(IMAGE_MIME_PREFIX)) {
            throw new IllegalArgumentException("El archivo debe ser un documento, no una imagen");
        }

        long maxSizeBytes = "image".equals(resourceType) ? 5L * 1024 * 1024 : 15L * 1024 * 1024;
        if (file.getSize() > maxSizeBytes) {
            throw new IllegalArgumentException("El archivo es demasiado grande. Máximo permitido: "
                    + (maxSizeBytes / (1024 * 1024)) + "MB");
        }
    }

    private String sanitizePublicId(String originalFilename) {
        if (originalFilename == null || originalFilename.isBlank()) {
            return "archivo";
        }

        String withoutExtension = originalFilename.replaceAll("\\.[^.]+$", "");
        return withoutExtension.toLowerCase()
                .replaceAll("[^a-z0-9]+", "_")
                .replaceAll("_+", "_")
                .replaceAll("^_|_$", "");
    }

}
