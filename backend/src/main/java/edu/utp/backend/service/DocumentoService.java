package edu.utp.backend.service;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import edu.utp.backend.entity.Documento;
import edu.utp.backend.entity.Instructor;
import edu.utp.backend.repository.DocumentoRepository;
import edu.utp.backend.repository.InstructorRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocumentoService {

    private final DocumentoRepository documentoRepository;
    private final InstructorRepository instructorRepository;

    // getall
    public List<Documento> findAll() {
        return documentoRepository.findAll();
    }

    // GET BY ID
    public Documento findById(Integer id) {
        return documentoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Id de documento no encontrado"));
    }

    // create
    public Documento create(Documento documento) {

        // No permitir ID manual
        if (documento.getIdDocumento() != null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El documento ya tiene un ID asignado");
        }

        // Validar instructor
        if (documento.getInstructor() == null ||
            documento.getInstructor().getIdInstructor() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Debe proporcionar un id_instructor válido");
        }

        Instructor instructor = instructorRepository
                .findById(documento.getInstructor().getIdInstructor())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Instructor no encontrado"));

        // Asignar instructor real
        documento.setInstructor(instructor);

        // Estado por defecto
        if (documento.getEstadoAprobacion() == null ||
            documento.getEstadoAprobacion().isBlank()) {
            documento.setEstadoAprobacion("pendiente");
        }

        // Fecha automática
        if (documento.getFechaSubida() == null) {
            documento.setFechaSubida(OffsetDateTime.now());
        }

        return documentoRepository.save(documento);
    }

    // update
    public Documento update(Integer id, Documento documento) {

        Documento aux = documentoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Id de documento no encontrado"));

        // Validar instructor si se envía
        if (documento.getInstructor() != null &&
            documento.getInstructor().getIdInstructor() != null) {

            Instructor instructor = instructorRepository
                    .findById(documento.getInstructor().getIdInstructor())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Instructor no encontrado"));

            aux.setInstructor(instructor);
        }

        aux.setNombreDocumento(documento.getNombreDocumento());
        aux.setUrlArchivo(documento.getUrlArchivo());

        // Solo actualizar estado si viene valor
        if (documento.getEstadoAprobacion() != null &&
            !documento.getEstadoAprobacion().isBlank()) {
            aux.setEstadoAprobacion(documento.getEstadoAprobacion());
        }

        if (documento.getFechaSubida() != null) {
            aux.setFechaSubida(documento.getFechaSubida());
        }

        return documentoRepository.save(aux);
    }

    // delete
    public void delete(Integer id) {

        Documento documento = documentoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Id de documento no encontrado"));

        documentoRepository.deleteById(documento.getIdDocumento());
    }
}
