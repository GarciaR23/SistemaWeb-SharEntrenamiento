package edu.utp.backend.features.admin.reporte.repositories;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
public class AdminDashboardRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @SuppressWarnings("unchecked")
    public List<Object[]> obtenerCrecimientoInstructores(Timestamp fechaInicio, Timestamp fechaFin) {
        return entityManager
                .createNativeQuery(
                        "SELECT * FROM public.fn_dashboard_crecimiento_instructores(:fechaInicio, :fechaFin)")
                .setParameter("fechaInicio", fechaInicio)
                .setParameter("fechaFin", fechaFin)
                .getResultList();
    }

    public Double obtenerPorcentajeMensual() {
        Object result = entityManager
                .createNativeQuery("SELECT public.fn_dashboard_porcentaje_mensual()")
                .getSingleResult();
        if (result instanceof BigDecimal bd) {
            return bd.doubleValue();
        }
        if (result instanceof Number num) {
            return num.doubleValue();
        }
        return 0.0;
    }

    @SuppressWarnings("unchecked")
    public List<Object[]> obtenerEstadoSolicitudes() {
        return entityManager
                .createNativeQuery("SELECT * FROM public.fn_dashboard_estado_solicitud()")
                .getResultList();
    }

    public Long contarTotalInstructores() {
        return ((Number) entityManager
                .createNativeQuery("SELECT COUNT(*) FROM usuario WHERE rol = 'instructor'::tipo_rol")
                .getSingleResult()).longValue();
    }
}