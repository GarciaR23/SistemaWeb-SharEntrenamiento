package edu.utp.backend.features.admin.revision.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import edu.utp.backend.features.admin.revision.entities.RevisionDocumento;
import edu.utp.backend.features.admin.revision.enums.TipoAprobacion;

@Repository
public interface RevisionDocumentoRepository extends JpaRepository<RevisionDocumento, Integer> {

        @Query("SELECT COUNT(r) FROM RevisionDocumento r " +
                        "JOIN Documento d ON r.idDocumento = d.idDocumento " +
                        "WHERE d.idInstructor = :idInstructor AND r.resultadoRevision = :status")
        long countByInstructorIdAndResultado(@Param("idInstructor") Integer idInstructor,
                        @Param("status") TipoAprobacion status);

        @Query(value = "SELECT r.comentario_admin, r.fecha_respuesta " +
                        "FROM revision_documento r " +
                        "WHERE r.id_documento = :idDocumento AND r.resultado_revision = 'rechazado' " +
                        "ORDER BY r.fecha_respuesta DESC " +
                        "LIMIT 1", nativeQuery = true)
        List<Object[]> findHistorialRechazosByDocumento(@Param("idDocumento") Long idDocumento);

        @Query(value = """
            SELECT DISTINCT ON (d.id_documento)
                d.id_documento,
                d.nombre_documento,
                d.url_archivo,
                d.estado_aprobacion,
                r.comentario_admin,
                r.fecha_respuesta
            FROM documento d INNER JOIN revision_documento r 
                ON r.id_documento = d.id_documento
            WHERE d.id_instructor = :idInstructor
              AND d.estado_aprobacion = 'rechazado'
              AND r.resultado_revision = 'rechazado'
            ORDER BY d.id_documento, r.fecha_respuesta DESC
            """, nativeQuery = true)
        List<Object[]> findDocumentosObservadosPorInstructor(@Param("idInstructor") Long idInstructor);
}