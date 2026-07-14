package edu.utp.backend.features.rendimiento.hoja_ruta.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import edu.utp.backend.features.rendimiento.hoja_ruta.entities.HojaRuta;

@Repository
public interface HojaRutaRepository extends JpaRepository<HojaRuta, Integer> {

    Optional<HojaRuta> findByIdReserva(Integer idReserva);

    @Query(value = """
            SELECT
                p.url_imagen_paciente,
                p.nombre_completo,
                dr.duracion_entrenamiento::text,
                s.id_sede,
                s.nombre_sede,
                s.zona_sede,
                s.url_imagen_sede_1,
                s.url_imagen_sede_2,
                s.url_imagen_sede_3
            FROM reserva r
            INNER JOIN paciente p ON r.id_paciente = p.id_paciente
            INNER JOIN detalle_reserva dr ON r.id_reserva = dr.id_reserva
            INNER JOIN sede s ON r.id_sede = s.id_sede
            WHERE r.id_reserva = :idReserva
            """, nativeQuery = true)
    List<Object[]> obtenerDatosFormulario(@Param("idReserva") Integer idReserva);

    @Query(value = "SELECT * FROM public.fn_instructor_contador_hojas(:idInstructor)", nativeQuery = true)
    List<Object[]> obtenerContadorHojas(@Param("idInstructor") Integer idInstructor);

    @Query(value = """
            SELECT
                r.id_reserva,
                hr.id_ruta,
                p.url_imagen_paciente,
                p.nombre_completo,
                dr.duracion_entrenamiento::text,
                s.nombre_sede,
                s.zona_sede,
                CASE
                    WHEN hr.id_ruta IS NULL OR hr.estado_hoja = 'pendiente_envio' THEN 'por_configurar'
                    WHEN hr.estado_hoja IN ('enviado_al_tutor', 'aprobado_tutor') THEN 'completado'
                    WHEN hr.estado_hoja = 'observado_tutor' THEN 'con_observacion'
                END AS clasificacion,
                COALESCE(hr.estado_hoja::text, 'pendiente_envio') AS estado_hoja,
                hr.fecha_creacion
            FROM reserva r
            INNER JOIN paciente p ON r.id_paciente = p.id_paciente
            INNER JOIN detalle_reserva dr ON r.id_reserva = dr.id_reserva
            INNER JOIN sede s ON r.id_sede = s.id_sede
            LEFT JOIN hoja_ruta hr ON r.id_reserva = hr.id_reserva
            WHERE r.id_instructor = :idInstructor
              AND r.estado_reserva = 'aprobada'
            ORDER BY hr.fecha_creacion DESC NULLS LAST
            """, nativeQuery = true)
    List<Object[]> obtenerCardsClasificadas(@Param("idInstructor") Integer idInstructor);
}