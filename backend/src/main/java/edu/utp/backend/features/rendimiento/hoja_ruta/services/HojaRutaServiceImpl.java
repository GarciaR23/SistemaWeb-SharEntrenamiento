package edu.utp.backend.features.rendimiento.hoja_ruta.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.utp.backend.features.rendimiento.hoja_ruta.dtos.CardHojaRutaDTO;
import edu.utp.backend.features.rendimiento.hoja_ruta.dtos.ContadorHojasDTO;
import edu.utp.backend.features.rendimiento.hoja_ruta.dtos.FormularioHojaRutaDTO;
import edu.utp.backend.features.rendimiento.hoja_ruta.dtos.HojaRutaRequestDTO;
import edu.utp.backend.features.rendimiento.hoja_ruta.dtos.HojaRutaResponseDTO;
import edu.utp.backend.features.rendimiento.hoja_ruta.entities.HojaRuta;
import edu.utp.backend.features.rendimiento.hoja_ruta.enums.EstadoHoja;
import edu.utp.backend.features.rendimiento.hoja_ruta.repositories.HojaRutaRepository;
import edu.utp.backend.features.sede.dtos.SedeResumenDTO;
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
        entity.setEstadoHoja(EstadoHoja.pendiente_envio);
        return toResponse(hojaRutaRepository.save(entity));
    }

    @Override
    @Transactional(readOnly = true)
    public FormularioHojaRutaDTO obtenerFormulario(Integer idReserva) {
        List<Object[]> datos = hojaRutaRepository.obtenerDatosFormulario(idReserva);

        if (datos.isEmpty()) {
            throw new IllegalArgumentException("Reserva no encontrada: " + idReserva);
        }

        Object[] row = datos.get(0);

        SedeResumenDTO sede = new SedeResumenDTO(
                ((Number) row[3]).intValue(),
                (String) row[4],
                (String) row[5],
                (String) row[6],
                (String) row[7],
                (String) row[8]);

        return new FormularioHojaRutaDTO(
                idReserva,
                (String) row[0],
                (String) row[1],
                (String) row[2],
                sede);
    }

    @Override
    @Transactional(readOnly = true)
    public ContadorHojasDTO obtenerContadorHojas(Integer idInstructor) {
        List<Object[]> results = hojaRutaRepository.obtenerContadorHojas(idInstructor);
        Object[] result = results.get(0);
        return new ContadorHojasDTO(
                ((Number) result[0]).longValue(),
                ((Number) result[1]).longValue(),
                ((Number) result[2]).longValue());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CardHojaRutaDTO> obtenerCardsClasificadas(Integer idInstructor) {
        List<Object[]> results = hojaRutaRepository.obtenerCardsClasificadas(idInstructor);
        return results.stream()
                .map(row -> new CardHojaRutaDTO(
                        ((Number) row[0]).intValue(),
                        row[1] != null ? ((Number) row[1]).intValue() : null,
                        (String) row[2],
                        (String) row[3],
                        (String) row[4],
                        (String) row[5],
                        (String) row[6],
                        (String) row[7],
                        (String) row[8],
                        row[9] != null ? ((java.sql.Timestamp) row[9]).toLocalDateTime() : null))
                .toList();
    }

    @Override
    @Transactional
    public HojaRutaResponseDTO enviarHojaRuta(Integer idRuta) {
        HojaRuta hojaRuta = hojaRutaRepository.findById(idRuta)
                .orElseThrow(() -> new IllegalArgumentException("Hoja de ruta no encontrada: " + idRuta));
        hojaRuta.setEstadoHoja(EstadoHoja.enviado_al_tutor);
        hojaRuta.setFechaActualizacion(LocalDateTime.now());
        return toResponse(hojaRutaRepository.save(hojaRuta));
    }

    @Override
    @Transactional
    public HojaRutaResponseDTO actualizarEstado(Integer idRuta, String estado) {
        HojaRuta hojaRuta = hojaRutaRepository.findById(idRuta)
                .orElseThrow(() -> new IllegalArgumentException("Hoja de ruta no encontrada: " + idRuta));
        hojaRuta.setEstadoHoja(EstadoHoja.valueOf(estado));
        hojaRuta.setFechaActualizacion(LocalDateTime.now());
        return toResponse(hojaRutaRepository.save(hojaRuta));
    }

    private HojaRutaResponseDTO toResponse(HojaRuta entity) {
        return new HojaRutaResponseDTO(
                entity.getIdRuta(),
                entity.getIdReserva(),
                entity.getEstadoHoja() != null ? entity.getEstadoHoja().name() : null,
                entity.getFechaCreacion(),
                entity.getFechaActualizacion());
    }
}