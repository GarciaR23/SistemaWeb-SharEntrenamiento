package edu.utp.backend.features.rendimiento.hoja_ruta.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.utp.backend.features.rendimiento.hoja_ruta.dtos.HojaRutaRequestDTO;
import edu.utp.backend.features.rendimiento.hoja_ruta.dtos.HojaRutaResponseDTO;
import edu.utp.backend.features.rendimiento.hoja_ruta.services.HojaRutaService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/hojas-ruta")
@RequiredArgsConstructor
public class HojaRutaController {

    private final HojaRutaService hojaRutaService;

    @GetMapping
    public List<HojaRutaResponseDTO> findAll() {
        return hojaRutaService.findAll();
    }

    @GetMapping("/{id}")
    public HojaRutaResponseDTO findById(@PathVariable Integer id) {
        return hojaRutaService.findById(id);
    }

    @PostMapping
    public HojaRutaResponseDTO create(@RequestBody HojaRutaRequestDTO request) {
        return hojaRutaService.create(request);
    }
}