package edu.utp.backend.features.rendimiento.hoja_ruta.services;

import java.util.List;

import edu.utp.backend.features.rendimiento.hoja_ruta.dtos.CardHojaRutaDTO;
import edu.utp.backend.features.rendimiento.hoja_ruta.dtos.ContadorHojasDTO;
import edu.utp.backend.features.rendimiento.hoja_ruta.dtos.FormularioHojaRutaDTO;
import edu.utp.backend.features.rendimiento.hoja_ruta.dtos.HojaRutaRequestDTO;
import edu.utp.backend.features.rendimiento.hoja_ruta.dtos.HojaRutaResponseDTO;

public interface HojaRutaService {
    List<HojaRutaResponseDTO> findAll();

    HojaRutaResponseDTO findById(Integer id);

    HojaRutaResponseDTO create(HojaRutaRequestDTO request);

    FormularioHojaRutaDTO obtenerFormulario(Integer idReserva);

    ContadorHojasDTO obtenerContadorHojas(Integer idInstructor);

    List<CardHojaRutaDTO> obtenerCardsClasificadas(Integer idInstructor);

    HojaRutaResponseDTO enviarHojaRuta(Integer idRuta);

    HojaRutaResponseDTO actualizarEstado(Integer idRuta, String estado);
}