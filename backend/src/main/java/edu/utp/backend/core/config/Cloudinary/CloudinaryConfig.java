package edu.utp.backend.core.config.Cloudinary;

import java.lang.reflect.Constructor;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;

@Configuration
public class CloudinaryConfig {
    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    @Bean(name = "cloudinary")
    @ConditionalOnClass(name = "com.cloudinary.Cloudinary")
    public Object cloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", "dqsvab8rl");
        config.put("api_key", apiKey);
        config.put("api_secret", apiSecret);
        config.put("secure", "true");

        try {
            Class<?> cloudinaryClass = Class.forName("com.cloudinary.Cloudinary");
            Constructor<?> constructor = cloudinaryClass.getConstructor(Map.class);
            return constructor.newInstance(config);
        } catch (ReflectiveOperationException e) {
            throw new IllegalStateException("No se pudo inicializar Cloudinary", e);
        }
    }
}
