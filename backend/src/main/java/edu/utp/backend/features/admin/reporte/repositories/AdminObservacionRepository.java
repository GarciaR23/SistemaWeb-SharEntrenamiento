package edu.utp.backend.features.admin.reporte.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
public class AdminObservacionRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public Object[] obtenerContadoresObservaciones() {
        return (Object[]) entityManager
                .createNativeQuery("""
                        SELECT
                            COUNT(*) AS total_casos,
                            SUM(CASE WHEN accion_sugerida = 'mediacion' THEN 1 ELSE 0 END) AS en_mediacion,
                            SUM(CASE WHEN accion_sugerida = 'rechazado' THEN 1 ELSE 0 END) AS rechazados
                        FROM public.vista_admin_observaciones_reclamo
                        """)
                .getSingleResult();
    }

    @SuppressWarnings("unchecked")
    public List<Object[]> obtenerObservaciones() {
        return entityManager
                .createNativeQuery("SELECT * FROM public.vista_admin_observaciones_reclamo ORDER BY id_incidencia DESC")
                .getResultList();
    }

    public void actualizarAccion(Integer idIncidencia, String accion) {
        entityManager
                .createNativeQuery("""
                        UPDATE detalle_incidencia
                        SET accion_sugerida = CAST(:accion AS tipo_accion)
                        WHERE id_incidencia = :idIncidencia
                        """)
                .setParameter("idIncidencia", idIncidencia)
                .setParameter("accion", accion)
                .executeUpdate();
    }
}