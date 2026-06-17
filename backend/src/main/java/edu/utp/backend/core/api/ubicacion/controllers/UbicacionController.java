package edu.utp.backend.core.api.ubicacion.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/ubicacion")
@CrossOrigin(origins = "http://localhost:4200")
public class UbicacionController {

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/ubigeos")
    public ResponseEntity<String> obtenerUbigeos() {
        String url = "https://free.e-api.net.pe/ubigeos.json";
        String response = restTemplate.getForObject(url, String.class);
        return ResponseEntity.ok(response);
    }
}