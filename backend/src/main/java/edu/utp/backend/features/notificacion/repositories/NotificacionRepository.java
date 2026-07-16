package edu.utp.backend.features.notificacion.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
public class NotificacionRepository {

    @PersistenceContext
    private EntityManager entityManager;

    // ADMIN
    @SuppressWarnings("unchecked")
    public List<Object[]> obtenerNotificacionesAdmin() {
        return entityManager
                .createNativeQuery("SELECT * FROM public.vista_notificaciones_admin ORDER BY fecha DESC LIMIT 10")
                .getResultList();
    }

    public Long contarTotalAdmin() {
        return ((Number) entityManager
                .createNativeQuery("SELECT COUNT(*) FROM public.vista_notificaciones_admin")
                .getSingleResult()).longValue();
    }

    // INSTRUCTOR
    @SuppressWarnings("unchecked")
    public List<Object[]> obtenerNotificacionesInstructor(Integer idInstructor) {
        return entityManager
                .createNativeQuery(
                        "SELECT * FROM public.vista_notificaciones_instructor WHERE id_instructor = :idInstructor ORDER BY fecha DESC LIMIT 10")
                .setParameter("idInstructor", idInstructor)
                .getResultList();
    }

    public Long contarTotalInstructor(Integer idInstructor) {
        return ((Number) entityManager
                .createNativeQuery(
                        "SELECT COUNT(*) FROM public.vista_notificaciones_instructor WHERE id_instructor = :idInstructor")
                .setParameter("idInstructor", idInstructor)
                .getSingleResult()).longValue();
    }

    // PACIENTE
    @SuppressWarnings("unchecked")
    public List<Object[]> obtenerNotificacionesPaciente(Integer idPaciente) {
        return entityManager
                .createNativeQuery(
                        "SELECT * FROM public.vista_notificaciones_paciente WHERE id_paciente = :idPaciente ORDER BY fecha DESC LIMIT 10")
                .setParameter("idPaciente", idPaciente)
                .getResultList();
    }

    public Long contarTotalPaciente(Integer idPaciente) {
        return ((Number) entityManager
                .createNativeQuery(
                        "SELECT COUNT(*) FROM public.vista_notificaciones_paciente WHERE id_paciente = :idPaciente")
                .setParameter("idPaciente", idPaciente)
                .getSingleResult()).longValue();
    }
}