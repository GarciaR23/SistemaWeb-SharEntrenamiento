package edu.utp.backend.features.documento.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import edu.utp.backend.features.documento.entities.Documento;

public interface DocumentoRepository extends JpaRepository<Documento, Long> {
    List<Documento> findByIdInstructor(Long idInstructor);

    @Query(value = "SELECT COUNT(*) FROM documento WHERE id_instructor = :idInstructor AND estado_aprobacion = CAST(:estado AS tipo_aprobacion)", nativeQuery = true)
    long countByIdInstructorAndEstadoAprobacion(@Param("idInstructor") Long idInstructor,
            @Param("estado") String estadoAprobacion);
}