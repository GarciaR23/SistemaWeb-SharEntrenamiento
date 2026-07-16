package edu.utp.backend.features.documento.services;

import java.sql.Timestamp;
import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.utp.backend.features.admin.revision.repositories.RevisionDocumentoRepository;
import edu.utp.backend.features.documento.dtos.DocumentoCorreccionRequest;
import edu.utp.backend.features.documento.dtos.DocumentoDto;
import edu.utp.backend.features.documento.dtos.DocumentoObservadoDto;
import edu.utp.backend.features.documento.dtos.InstructorModalDto;
import edu.utp.backend.features.documento.entities.Documento;
import edu.utp.backend.features.documento.repositories.DocumentoRepository;
import edu.utp.backend.features.instructor.repositories.InstructorRepository;
import edu.utp.backend.features.usuario.entities.Usuario;
import edu.utp.backend.features.usuario.enums.EstadoCuenta;
import edu.utp.backend.features.usuario.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocumentoServiceImpl implements DocumentoService {

    private final DocumentoRepository documentoRepository;
    private final RevisionDocumentoRepository revisionDocuRepo;
    private final InstructorRepository instructorRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    public List<DocumentoDto> findAll() {
        return documentoRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    public DocumentoDto findById(Long id) {
        return documentoRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Documento no encontrado: " + id));
    }

    @Override
    @Transactional
    public DocumentoDto create(DocumentoDto request) {
        Documento documento = new Documento();
        apply(documento, request);
        return toDto(documentoRepository.save(documento));
    }

    @Override
    @Transactional
    public DocumentoDto update(Long id, DocumentoDto request) {
        Documento documento = documentoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Documento no encontrado: " + id));
        apply(documento, request);
        return toDto(documentoRepository.save(documento));
    }

    @Override
    @Transactional(readOnly = true)
    public InstructorModalDto obtenerDocumentosParaModal(Long idInstructor) {
        List<Documento> documentos = documentoRepository.findByIdInstructor(idInstructor);

        List<DocumentoDto> documentosDto = documentos.stream()
                .map(this::toDto)
                .toList();

        return new InstructorModalDto(idInstructor, documentosDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentoObservadoDto> obtenerDocumentosObservados(Long idInstructor) {
        List<Object[]> rows = revisionDocuRepo.findDocumentosObservadosPorInstructor(idInstructor);

        return rows.stream().map(row -> new DocumentoObservadoDto(
                ((Number) row[0]).longValue(),
                (String) row[1],
                (String) row[2],
                String.valueOf(row[3]),
                (String) row[4],
                convertirFecha(row[5])
        )).toList();
    }

    @Override
    @Transactional
    public DocumentoDto corregirDocumento(Long idDocumento, DocumentoCorreccionRequest request) {
        Documento documento = documentoRepository.findById(idDocumento)
                .orElseThrow(() -> new IllegalArgumentException("Documento no encontrado: " + idDocumento));

        if (!"rechazado".equalsIgnoreCase(documento.getEstadoAprobacion())) {
            throw new IllegalArgumentException("Solo se pueden corregir documentos rechazados.");
        }

        documento.setUrlArchivo(request.urlArchivo());
        documento.setEstadoAprobacion("pendiente");

        return toDto(documentoRepository.save(documento));
    }

    @Override
    @Transactional
    public void finalizarCorreccionInstructor(Long idInstructor) {
        Long idUsuario = instructorRepository.findById(idInstructor.intValue())
                .map(instructor -> instructor.getIdUsuario())
                .orElseThrow(() -> new IllegalArgumentException("Instructor no encontrado: " + idInstructor));

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado: " + idUsuario));

        usuario.setEstadoCuenta(EstadoCuenta.pendiente_validacion);
        usuarioRepository.save(usuario);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        documentoRepository.deleteById(id);
    }

    private ZonedDateTime convertirFecha(Object value) {
        if (value == null) {
            return null;
        }

        if (value instanceof ZonedDateTime zonedDateTime) {
            return zonedDateTime;
        }

        if (value instanceof java.time.OffsetDateTime offsetDateTime) {
            return offsetDateTime.toZonedDateTime();
        }

        if (value instanceof Timestamp timestamp) {
            return timestamp.toInstant().atZone(java.time.ZoneId.systemDefault());
        }

        return ZonedDateTime.parse(value.toString());
    }

    private void apply(Documento documento, DocumentoDto request) {
        documento.setIdInstructor(request.idInstructor());
        documento.setNombreDocumento(request.nombreDocumento());
        documento.setUrlArchivo(request.urlArchivo());
        documento.setEstadoAprobacion(request.estadoAprobacion());
    }

    private DocumentoDto toDto(Documento documento) {
        return new DocumentoDto(
                documento.getIdDocumento(),
                documento.getIdInstructor(),
                documento.getNombreDocumento(),
                documento.getUrlArchivo(),
                documento.getEstadoAprobacion(),
                documento.getFechaSubida());
    }
}