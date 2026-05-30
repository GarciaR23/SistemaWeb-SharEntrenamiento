package edu.utp.backend.features.rendimiento.hoja_ruta.services;

import java.util.List;

import edu.utp.backend.features.rendimiento.hoja_ruta.dtos.HojaRutaRequestDTO;
import edu.utp.backend.features.rendimiento.hoja_ruta.dtos.HojaRutaResponseDTO;

public interface HojaRutaService {
    List<HojaRutaResponseDTO> findAll();

    HojaRutaResponseDTO findById(Integer id);

    HojaRutaResponseDTO create(HojaRutaRequestDTO request);
}