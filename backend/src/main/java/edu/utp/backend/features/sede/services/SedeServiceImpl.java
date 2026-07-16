package edu.utp.backend.features.sede.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.utp.backend.features.sede.dtos.SedeRequest;
import edu.utp.backend.features.sede.dtos.SedeResponse;
import edu.utp.backend.features.sede.entities.Sede;
import edu.utp.backend.features.sede.repositories.SedeRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SedeServiceImpl implements SedeService {

    private final SedeRepository sedeRepository;

    private static final int MAX_SEDES_ACTIVAS = 3;

    @Override
    public List<SedeResponse> findAll() {
        return sedeRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    public SedeResponse findById(Integer id) {
        return sedeRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Sede no encontrada: " + id));
    }

    @Override
    @Transactional
    public SedeResponse create(SedeRequest request) {
        boolean estado = request.estadoActivacion() == null ? true : request.estadoActivacion();

        if (estado) {
            long activas = sedeRepository.countActivasByInstructor(request.idInstructor());
            if (activas >= MAX_SEDES_ACTIVAS) {
                throw new IllegalStateException(
                        "Ya tienes " + MAX_SEDES_ACTIVAS
                                + " sedes activas. Debes desactivar una antes de añadir una nueva.");
            }
        }

        Sede sede = new Sede();
        apply(sede, request);
        return toDto(sedeRepository.save(sede));
    }

    @Override
    @Transactional
    public SedeResponse update(Integer id, SedeRequest request) {
        Sede sede = sedeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Sede no encontrada: " + id));
        apply(sede, request);
        return toDto(sedeRepository.save(sede));
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        sedeRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SedeResponse> listarPorInstructor(Integer idInstructor) {
        return sedeRepository.findByIdInstructorOrderByIdSedeDesc(idInstructor)
                .stream().map(this::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SedeResponse> buscarPorDistrito(Integer idInstructor, String distrito) {
        return sedeRepository
                .findByIdInstructorAndDistritoSedeContainingIgnoreCaseOrderByIdSedeDesc(
                        idInstructor,
                        distrito == null ? "" : distrito)
                .stream().map(this::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SedeResponse> buscarPorDireccion(Integer idInstructor, String direccion) {
        return sedeRepository
                .findByIdInstructorAndDireccionSedeContainingIgnoreCaseOrderByIdSedeDesc(
                        idInstructor,
                        direccion == null ? "" : direccion)
                .stream().map(this::toDto).toList();
    }

    @Override
    @Transactional
    public SedeResponse actualizarEstado(Integer idSede, Boolean estadoActivacion) {
        Sede sede = sedeRepository.findById(idSede)
                .orElseThrow(() -> new IllegalArgumentException("Sede no encontrada: " + idSede));

        boolean nuevoEstado = estadoActivacion == null ? false : estadoActivacion;

        // Solo validar cuando se intenta ACTIVAR una sede que estaba inactiva
        if (nuevoEstado && !Boolean.TRUE.equals(sede.getEstadoActivacion())) {
            long activas = sedeRepository.countActivasByInstructor(sede.getIdInstructor());
            if (activas >= MAX_SEDES_ACTIVAS) {
                throw new IllegalStateException(
                        "Ya tienes " + MAX_SEDES_ACTIVAS
                                + " sedes activas. Debes desactivar una antes de activar otra.");
            }
        }

        sede.setEstadoActivacion(nuevoEstado);
        return toDto(sedeRepository.save(sede));
    }

    private void apply(Sede sede, SedeRequest request) {
        sede.setIdInstructor(request.idInstructor());
        sede.setZonaSede(request.zonaSede());
        sede.setNombreSede(request.nombreSede());
        sede.setUrlImagenSede1(request.urlImagenSede1());
        sede.setUrlImagenSede2(request.urlImagenSede2());
        sede.setUrlImagenSede3(request.urlImagenSede3());
        sede.setDescripcionSede(request.descripcionSede());
        sede.setDireccionSede(request.direccionSede());
        sede.setDistritoSede(request.distritoSede());
        sede.setEstadoActivacion(request.estadoActivacion() == null ? true : request.estadoActivacion());
    }

    private SedeResponse toDto(Sede sede) {
        return new SedeResponse(
                sede.getIdSede(),
                sede.getIdInstructor(),
                sede.getZonaSede() != null ? sede.getZonaSede() : null,
                sede.getNombreSede(),
                sede.getUrlImagenSede1(),
                sede.getUrlImagenSede2(),
                sede.getUrlImagenSede3(),
                sede.getDescripcionSede(),
                sede.getDireccionSede(),
                sede.getDistritoSede(),
                sede.getEstadoActivacion(),
                generarNombreCard(sede),
                obtenerImagenes(sede),
                generarEtiqueta(sede.getDistritoSede()));
    }

    private String generarNombreCard(Sede sede) {
        return "Sede " + sede.getZonaSede() + " - " + normalizarTexto(sede.getNombreSede());
    }

    private String generarEtiqueta(String distrito) {
        if (distrito == null || distrito.isBlank()) {
            return "ESPACIO DE ENTRENAMIENTO";
        }

        String distritoNormalizado = distrito.trim().toLowerCase();

        if (distritoNormalizado.contains("miraflores")) {
            return "ESPACIO DE ÉLITE";
        }

        if (distritoNormalizado.contains("san isidro")) {
            return "BIENESTAR";
        }

        if (distritoNormalizado.contains("la molina")) {
            return "CENTRO DOJO";
        }

        if (distritoNormalizado.contains("barranco")) {
            return "ESTUDIO";
        }

        return "ESPACIO DE ENTRENAMIENTO";
    }

    private List<String> obtenerImagenes(Sede sede) {
        List<String> imagenes = new ArrayList<>();

        agregarImagenSiExiste(imagenes, sede.getUrlImagenSede1());
        agregarImagenSiExiste(imagenes, sede.getUrlImagenSede2());
        agregarImagenSiExiste(imagenes, sede.getUrlImagenSede3());

        return imagenes;
    }

    private void agregarImagenSiExiste(List<String> imagenes, String url) {
        if (url != null && !url.isBlank()) {
            imagenes.add(url);
        }
    }

    private String normalizarTexto(String value) {
        if (value == null || value.isBlank()) {
            return "";
        }

        String limpio = value.trim().toLowerCase();

        return Character.toUpperCase(limpio.charAt(0)) + limpio.substring(1);
    }
}