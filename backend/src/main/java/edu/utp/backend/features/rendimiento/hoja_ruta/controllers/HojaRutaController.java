package edu.utp.backend.features.rendimiento.hoja_ruta.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.utp.backend.features.rendimiento.hoja_ruta.dtos.CardHojaRutaDTO;
import edu.utp.backend.features.rendimiento.hoja_ruta.dtos.ContadorHojasDTO;
import edu.utp.backend.features.rendimiento.hoja_ruta.dtos.FormularioHojaRutaDTO;
import edu.utp.backend.features.rendimiento.hoja_ruta.dtos.HojaRutaRequestDTO;
import edu.utp.backend.features.rendimiento.hoja_ruta.dtos.HojaRutaResponseDTO;
import edu.utp.backend.features.rendimiento.hoja_ruta.services.HojaRutaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/hoja-ruta")
@RequiredArgsConstructor
public class HojaRutaController {

    private final HojaRutaService hojaRutaService;

    @GetMapping
    public ResponseEntity<List<HojaRutaResponseDTO>> findAll() {
        return ResponseEntity.ok(hojaRutaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HojaRutaResponseDTO> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(hojaRutaService.findById(id));
    }

    @PostMapping
    public ResponseEntity<HojaRutaResponseDTO> create(@Valid @RequestBody HojaRutaRequestDTO request) {
        return ResponseEntity.ok(hojaRutaService.create(request));
    }

    @GetMapping("/formulario/{idReserva}")
    public ResponseEntity<FormularioHojaRutaDTO> obtenerFormulario(
            @PathVariable Integer idReserva) {
        return ResponseEntity.ok(hojaRutaService.obtenerFormulario(idReserva));
    }

    @GetMapping("/contador-hojas/{idInstructor}")
    public ResponseEntity<ContadorHojasDTO> obtenerContadorHojas(
            @PathVariable Integer idInstructor) {
        return ResponseEntity.ok(hojaRutaService.obtenerContadorHojas(idInstructor));
    }

    @GetMapping("/cards-clasificadas/{idInstructor}")
    public ResponseEntity<List<CardHojaRutaDTO>> obtenerCardsClasificadas(
            @PathVariable Integer idInstructor) {
        return ResponseEntity.ok(hojaRutaService.obtenerCardsClasificadas(idInstructor));
    }

    @PutMapping("/{idRuta}/enviar")
    public ResponseEntity<HojaRutaResponseDTO> enviarHojaRuta(
            @PathVariable Integer idRuta) {
        return ResponseEntity.ok(hojaRutaService.enviarHojaRuta(idRuta));
    }
}