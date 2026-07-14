package edu.utp.backend.features.rendimiento.rutina.services;

import java.time.Duration;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.utp.backend.features.rendimiento.hoja_ruta.entities.HojaRuta;
import edu.utp.backend.features.rendimiento.hoja_ruta.repositories.HojaRutaRepository;
import edu.utp.backend.features.rendimiento.rutina.dtos.DetalleRutinaRequestDTO;
import edu.utp.backend.features.rendimiento.rutina.dtos.DetalleRutinaResponseDTO;
import edu.utp.backend.features.rendimiento.rutina.entities.DetalleRutina;
import edu.utp.backend.features.rendimiento.rutina.enums.TipoCategoriaEjercicio;
import edu.utp.backend.features.rendimiento.rutina.repositories.DetalleRutinaRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DetalleRutinaServiceImpl implements DetalleRutinaService {

    private final DetalleRutinaRepository detalleRutinaRepository;
    private final HojaRutaRepository hojaRutaRepository;

    @Override
    public List<DetalleRutinaResponseDTO> findAll() {
        return detalleRutinaRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public DetalleRutinaResponseDTO findById(Integer id) {
        return detalleRutinaRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Detalle de rutina no encontrado: " + id));
    }

    @Override
    public List<DetalleRutinaResponseDTO> findByIdRuta(Integer idRuta) {
        return detalleRutinaRepository.findByHojaRuta_IdRuta(idRuta)
                .stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional
    public DetalleRutinaResponseDTO create(DetalleRutinaRequestDTO request) {
        HojaRuta hojaRuta = hojaRutaRepository.findById(request.idRuta())
                .orElseThrow(() -> new IllegalArgumentException("Hoja de ruta no encontrada: " + request.idRuta()));

        // Obtener duración permitida
        String duracionPermitidaStr = detalleRutinaRepository.obtenerDuracionPermitida(request.idRuta());
        Duration duracionPermitida = Duration.parse(duracionPermitidaStr);

        // Sumar duraciones actuales
        List<DetalleRutina> ejerciciosActuales = detalleRutinaRepository.findByHojaRuta_IdRuta(request.idRuta());
        Duration duracionActual = ejerciciosActuales.stream()
                .map(DetalleRutina::getDuracionEstimada)
                .reduce(Duration.ZERO, Duration::plus);

        Duration nuevaDuracion = Duration.parse(request.duracionEstimada());
        Duration total = duracionActual.plus(nuevaDuracion);

        if (total.compareTo(duracionPermitida) > 0) {
            throw new IllegalArgumentException(
                    "La duración total de ejercicios (" + total.toMinutes() +
                            " min) excede la duración del entrenamiento (" + duracionPermitida.toMinutes() + " min).");
        }

        DetalleRutina entity = DetalleRutina.builder()
                .hojaRuta(hojaRuta)
                .nombreEjercicio(request.nombreEjercicio())
                .tipoEjercicio(TipoCategoriaEjercicio.valueOf(request.tipoEjercicio()))
                .descripcionEjercicio(request.descripcionEjercicio())
                .duracionEstimada(nuevaDuracion)
                .build();

        return toResponse(detalleRutinaRepository.save(entity));
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        detalleRutinaRepository.deleteById(id);
    }

    private DetalleRutinaResponseDTO toResponse(DetalleRutina entity) {
        return new DetalleRutinaResponseDTO(
                entity.getIdDetalle(),
                entity.getHojaRuta().getIdRuta(),
                entity.getNombreEjercicio(),
                entity.getTipoEjercicio() != null ? entity.getTipoEjercicio().name() : null,
                entity.getDescripcionEjercicio(),
                entity.getDuracionEstimada() != null ? entity.getDuracionEstimada().toString() : null);
    }
}