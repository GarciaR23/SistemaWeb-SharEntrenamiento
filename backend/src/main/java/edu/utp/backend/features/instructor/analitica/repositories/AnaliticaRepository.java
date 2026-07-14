package edu.utp.backend.features.instructor.analitica.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
public class AnaliticaRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public Object[] obtenerPromedioCalificacion() {
        return (Object[]) entityManager
                .createNativeQuery("SELECT * FROM public.fn_calificacion_estrella_servicio()")
                .getSingleResult();
    }

    public Object[] obtenerPacientesActivos() {
        return (Object[]) entityManager
                .createNativeQuery("SELECT * FROM public.fn_porcentaje_pacientes_activos()")
                .getSingleResult();
    }

    public Object[] obtenerSesionesFinalizadas() {
        return (Object[]) entityManager
                .createNativeQuery("SELECT * FROM public.fn_sesiones_finalizadas_porcentaje()")
                .getSingleResult();
    }

    @SuppressWarnings("unchecked")
    public List<Object[]> obtenerGraficoSesiones(Long idInstructor) {
        return entityManager
                .createNativeQuery("SELECT * FROM public.fn_instructor_grafico_sesiones(:idInstructor)")
                .setParameter("idInstructor", idInstructor)
                .getResultList();
    }

    @SuppressWarnings("unchecked")
    public List<Object[]> obtenerAgendaHoy(Integer idInstructor) {
        return entityManager
                .createNativeQuery("SELECT * FROM public.fn_instructor_agenda_hoy(:idInstructor)")
                .setParameter("idInstructor", idInstructor)
                .getResultList();
    }

    @SuppressWarnings("unchecked")
    public List<Object[]> obtenerAlertasPendientes(Integer idInstructor) {
        return entityManager
                .createNativeQuery(
                        "SELECT id_instructor, tipo_alerta, mensaje, id_referencia " +
                                "FROM public.vista_instructor_alertas_pendientes " +
                                "WHERE id_instructor = :idInstructor")
                .setParameter("idInstructor", idInstructor)
                .getResultList();
    }
}