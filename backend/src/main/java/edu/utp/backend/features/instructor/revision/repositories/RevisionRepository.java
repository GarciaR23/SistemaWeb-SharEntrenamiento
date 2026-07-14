package edu.utp.backend.features.instructor.revision.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
public class RevisionRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public void limpiarReservasVencidas() {
        entityManager
                .createNativeQuery("SELECT public.fn_limpiar_reservas_vencidas()")
                .getSingleResult();
    }

    @SuppressWarnings("unchecked")
    public List<Object[]> obtenerPacientesParaRevision(Integer idInstructor) {
        return entityManager
                .createNativeQuery("""
                        SELECT
                            dr.id_detalle,
                            r.id_reserva,
                            p.nombre_completo,
                            p.url_imagen_paciente,
                            p.edad,
                            dr.hora_inicio_estimada::date AS fecha_reserva,
                            dr.hora_inicio_estimada::time AS hora_inicio,
                            dr.duracion_entrenamiento::text,
                            s.zona_sede
                        FROM detalle_reserva dr
                        INNER JOIN reserva r ON dr.id_reserva = r.id_reserva
                        INNER JOIN paciente p ON r.id_paciente = p.id_paciente
                        INNER JOIN sede s ON r.id_sede = s.id_sede
                        WHERE r.id_instructor = :idInstructor
                          AND dr.estado_detalle = 'pendiente'
                        ORDER BY dr.hora_inicio_estimada ASC
                        """)
                .setParameter("idInstructor", idInstructor)
                .getResultList();
    }

    public Object[] obtenerFechaCritica(Integer idReserva) {
        return (Object[]) entityManager
                .createNativeQuery("""
                        SELECT
                            p.condicion AS sensibilidad_paciente,
                            'Protocolo estándar de emergencia' AS protocolo_emergencia,
                            p.grado_autismo::text,
                            p.condicion,
                            t.nombre_completo AS nombre_tutor
                        FROM reserva r
                        INNER JOIN paciente p ON r.id_paciente = p.id_paciente
                        INNER JOIN tutor t ON p.id_tutor = t.id_tutor
                        WHERE r.id_reserva = :idReserva
                        """)
                .setParameter("idReserva", idReserva)
                .getSingleResult();
    }

    public Object[] actualizarEstadoRevision(Integer idDetalle, String estadoDetalle) {
        return (Object[]) entityManager
                .createNativeQuery("""
                        UPDATE detalle_reserva
                        SET estado_detalle = CAST(:estadoDetalle AS estado_reserva_enum),
                            fecha_revision = CURRENT_TIMESTAMP
                        WHERE id_detalle = :idDetalle
                        RETURNING id_detalle, id_reserva, estado_detalle::text, fecha_revision
                        """)
                .setParameter("idDetalle", idDetalle)
                .setParameter("estadoDetalle", estadoDetalle)
                .getSingleResult();
    }

    public Long contarPendientes(Integer idInstructor) {
        return ((Number) entityManager
                .createNativeQuery("""
                        SELECT COUNT(*)
                        FROM detalle_reserva dr
                        INNER JOIN reserva r ON dr.id_reserva = r.id_reserva
                        WHERE r.id_instructor = :idInstructor
                          AND dr.estado_detalle = 'pendiente'
                        """)
                .setParameter("idInstructor", idInstructor)
                .getSingleResult()).longValue();
    }

    @SuppressWarnings("unchecked")
    public List<Object[]> obtenerRecienteSemanal(Integer idInstructor) {
        return entityManager
                .createNativeQuery("""
                        SELECT
                            dr.id_detalle,
                            p.nombre_completo,
                            CASE
                                WHEN r.fecha_creacion >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
                                THEN 'reciente'
                                ELSE 'semanal'
                            END AS clasificacion,
                            r.fecha_creacion
                        FROM detalle_reserva dr
                        INNER JOIN reserva r ON dr.id_reserva = r.id_reserva
                        INNER JOIN paciente p ON r.id_paciente = p.id_paciente
                        WHERE r.id_instructor = :idInstructor
                          AND dr.estado_detalle = 'pendiente'
                        ORDER BY r.fecha_creacion DESC
                        """)
                .setParameter("idInstructor", idInstructor)
                .getResultList();
    }
}