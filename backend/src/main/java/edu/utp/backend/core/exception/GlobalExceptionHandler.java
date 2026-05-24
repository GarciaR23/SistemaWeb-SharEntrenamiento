package edu.utp.backend.core.exception;

import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import jakarta.persistence.PersistenceException;

@ControllerAdvice
public class GlobalExceptionHandler {

    private final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @Value("${app.debug:false}")
    private boolean appDebug;

    @ExceptionHandler({ DataAccessResourceFailureException.class, PersistenceException.class })
    public ResponseEntity<Map<String, Object>> handleDatabaseUnavailable(Exception ex) {
        log.info("[CRÍTICO] Conexión a la base de datos interrumpida: ", ex);

        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "Servicio temporalmente no disponible. Error de conexión a la base de datos.");

        if (appDebug) {
            response.put("detail", ex.toString());
        }

        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleAll(Exception ex) {
        log.info("[ERROR INTERNO] Excepción no controlada detectada: ", ex);

        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "Error interno del servidor.");

        if (appDebug) {
            response.put("detail", ex.toString());
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}