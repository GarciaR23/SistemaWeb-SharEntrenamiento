package edu.utp.backend.features.admin.revision.services;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import edu.utp.backend.features.admin.revision.entities.RevisionDocumento;
import edu.utp.backend.features.admin.revision.enums.TipoAprobacion;
import edu.utp.backend.features.admin.revision.repository.RevisionDocumentoRepository;
import edu.utp.backend.features.documento.entities.Documento;
import edu.utp.backend.features.documento.repositories.DocumentoRepository;
import edu.utp.backend.features.auth.usuario.entities.Usuario;
import edu.utp.backend.features.auth.usuario.enums.EstadoCuenta;
import edu.utp.backend.features.auth.usuario.repositories.UsuarioRepository;
import edu.utp.backend.features.instructor.repositories.InstructorRepository;

@Service
@RequiredArgsConstructor
public class AdminRevisionService {

    private final RevisionDocumentoRepository revisionRepository;
    private final DocumentoRepository documentoRepository;
    private final UsuarioRepository usuarioRepository;
    private final InstructorRepository instructorRepository;

    @Transactional
    public void procesarRevisionDocumento(Long idInstructor, Long idDocumento, TipoAprobacion estadoDestino,
            String comentario, Integer idAdmin) {

        Documento documento = documentoRepository.findById(idDocumento)
                .orElseThrow(() -> new IllegalArgumentException("Documento no encontrado con el ID: " + idDocumento));

        documento.setEstadoAprobacion(estadoDestino.name());
        documentoRepository.save(documento);

        String comentarioSeguro = (comentario == null) ? "ACEPTABLE" : comentario;

        if (estadoDestino == TipoAprobacion.rechazado) {
            RevisionDocumento nuevaRevision = new RevisionDocumento();
            nuevaRevision.setIdDocumento(idDocumento.intValue());
            nuevaRevision.setIdUsuarioAdmin(idAdmin);
            nuevaRevision.setComentarioAdmin(comentarioSeguro);
            nuevaRevision.setResultadoRevision(TipoAprobacion.rechazado);
            revisionRepository.save(nuevaRevision);
        }

        verificarEstadoInstructor(idInstructor);
    }

    private void verificarEstadoInstructor(Long idInstructor) {
        long documentosAprobados = documentoRepository.countByIdInstructorAndEstadoAprobacion(idInstructor, "aprobado");

        Long idUsuario = instructorRepository.findById(idInstructor.intValue())
                .map(instructor -> instructor.getIdUsuario())
                .orElseThrow(() -> new IllegalArgumentException(
                        "No se encontró el instructor con ID: " + idInstructor));

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No se encontró el usuario con ID: " + idUsuario));

        if (documentosAprobados == 4) {
            usuario.setEstadoCuenta(EstadoCuenta.activo);
        } else {
            usuario.setEstadoCuenta(EstadoCuenta.pendiente_validacion);
        }

        usuarioRepository.save(usuario);
    }

    public List<Map<String, Object>> obtenerHistorialRechazosPorDocumento(Long idDocumento) {
        List<Object[]> resultados = revisionRepository.findHistorialRechazosByDocumento(idDocumento);

        return resultados.stream().map(row -> {
            Map<String, Object> item = new java.util.HashMap<>();
            item.put("comentario", row[0]);
            item.put("fecha", row[1].toString());
            return item;
        }).toList();
    }
}