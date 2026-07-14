package edu.utp.backend.features.rendimiento.rutina.services;

import java.util.List;

import edu.utp.backend.features.rendimiento.rutina.dtos.DetalleRutinaRequestDTO;
import edu.utp.backend.features.rendimiento.rutina.dtos.DetalleRutinaResponseDTO;

public interface DetalleRutinaService {
    List<DetalleRutinaResponseDTO> findAll();

    DetalleRutinaResponseDTO findById(Integer id);

    List<DetalleRutinaResponseDTO> findByIdRuta(Integer idRuta);

    DetalleRutinaResponseDTO create(DetalleRutinaRequestDTO request);

    void delete(Integer id);
}