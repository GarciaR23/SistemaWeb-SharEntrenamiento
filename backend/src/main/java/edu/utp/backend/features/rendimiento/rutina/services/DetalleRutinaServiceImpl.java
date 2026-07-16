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

        String duracionPermitidaStr = detalleRutinaRepository.obtenerDuracionPermitida(request.idRuta());
        Duration duracionPermitida = parseDuracion(duracionPermitidaStr);

        List<DetalleRutina> ejerciciosActuales = detalleRutinaRepository.findByHojaRuta_IdRuta(request.idRuta());
        Duration duracionActual = ejerciciosActuales.stream()
                .map(DetalleRutina::getDuracionEstimada)
                .reduce(Duration.ZERO, Duration::plus);

        Duration nuevaDuracion = parseDuracion(request.duracionEstimada());
        Duration total = duracionActual.plus(nuevaDuracion);

        if (total.compareTo(duracionPermitida) > 0) {
            throw new IllegalArgumentException(
                    "La duración total de ejercicios (" + total.toMinutes() +
                            " min) excede la duración del entrenamiento (" + duracionPermitida.toMinutes() + " min).");
        }

        DetalleRutina entity = DetalleRutina.builder()
                .hojaRuta(hojaRuta)
                .nombreEjercicio(request.nombreEjercicio())
                .tipoEjercicio(mapearTipo(request.tipoEjercicio()))
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

    private Duration parseDuracion(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("La duración es obligatoria.");
        }
        if (valor.startsWith("PT")) {
            return Duration.parse(valor);
        }
        if (valor.contains(":")) {
            String[] partes = valor.split(":");
            long horas = Long.parseLong(partes[0]);
            long minutos = Long.parseLong(partes[1]);
            long segundos = partes.length > 2 ? Long.parseLong(partes[2]) : 0;
            return Duration.ofHours(horas).plusMinutes(minutos).plusSeconds(segundos);
        }
        throw new IllegalArgumentException("Formato de duración no válido: " + valor);
    }

    private TipoCategoriaEjercicio mapearTipo(String tipo) {
        if (tipo == null)
            throw new IllegalArgumentException("El tipo de ejercicio es obligatorio.");
        return switch (tipo.toUpperCase()) {
            case "CARDIO" -> TipoCategoriaEjercicio.cardio;
            case "FUERZA" -> TipoCategoriaEjercicio.fuerza;
            case "FLEXIBILIDAD" -> TipoCategoriaEjercicio.regulacion_sensorial;
            case "MOVILIDAD" -> TipoCategoriaEjercicio.calentamiento;
            case "RESISTENCIA" -> TipoCategoriaEjercicio.relajacion;
            default -> throw new IllegalArgumentException("Tipo de ejercicio no válido: " + tipo);
        };
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