package edu.utp.backend.features.admin.revision.repository;

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
}