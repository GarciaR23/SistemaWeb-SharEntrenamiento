package edu.utp.backend.features.rendimiento.hoja_ruta.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.utp.backend.features.rendimiento.hoja_ruta.dtos.HojaRutaRequestDTO;
import edu.utp.backend.features.rendimiento.hoja_ruta.dtos.HojaRutaResponseDTO;
import edu.utp.backend.features.rendimiento.hoja_ruta.entities.HojaRuta;
import edu.utp.backend.features.rendimiento.hoja_ruta.repositories.HojaRutaRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HojaRutaServiceImpl implements HojaRutaService {

    private final HojaRutaRepository hojaRutaRepository;

    @Override
    public List<HojaRutaResponseDTO> findAll() {
        return hojaRutaRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public HojaRutaResponseDTO findById(Integer id) {
        return hojaRutaRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Hoja de ruta no encontrada: " + id));
    }

    @Override
    @Transactional
    public HojaRutaResponseDTO create(HojaRutaRequestDTO request) {
        HojaRuta entity = new HojaRuta();
        entity.setIdReserva(request.idReserva());
        entity.setIdPaciente(request.idPaciente());
        return toResponse(hojaRutaRepository.save(entity));
    }

    private HojaRutaResponseDTO toResponse(HojaRuta entity) {
        return new HojaRutaResponseDTO(
                entity.getIdRuta(),
                entity.getIdReserva(),
                entity.getIdPaciente(),
                entity.getVistoPorPaciente(),
                entity.getFechaEnvio());
    }
}