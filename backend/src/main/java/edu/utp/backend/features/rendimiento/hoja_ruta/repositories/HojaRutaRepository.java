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

    Optional<HojaRuta> findByIdDetalle(Integer idDetalle);

    @Query(value = """
            SELECT
                dr.id_detalle,
                p.url_imagen_paciente,
                p.nombre_completo,
                dr.duracion_entrenamiento::text,
                s.id_sede,
                s.nombre_sede,
                s.zona_sede,
                s.url_imagen_sede_1,
                s.url_imagen_sede_2,
                s.url_imagen_sede_3
            FROM detalle_reserva dr
            INNER JOIN reserva r ON dr.id_reserva = r.id_reserva
            INNER JOIN paciente p ON r.id_paciente = p.id_paciente
            INNER JOIN sede s ON r.id_sede = s.id_sede
            WHERE dr.id_detalle = :idDetalle
            """, nativeQuery = true)
    List<Object[]> obtenerDatosFormulario(@Param("idDetalle") Integer idDetalle);

    @Query(value = "SELECT * FROM public.fn_instructor_contador_hojas(:idInstructor)", nativeQuery = true)
    List<Object[]> obtenerContadorHojas(@Param("idInstructor") Integer idInstructor);

    @Query(value = """
            SELECT
                dr.id_detalle,
                r.id_reserva,
                hr.id_ruta,
                p.url_imagen_paciente,
                p.nombre_completo,
                dr.duracion_entrenamiento::text,
                s.nombre_sede,
                p.condicion,
                CASE
                    WHEN hr.id_ruta IS NULL OR hr.estado_hoja = 'pendiente_envio' THEN 'por_configurar'
                    WHEN hr.estado_hoja IN ('enviado_al_tutor', 'aprobado_tutor') THEN 'completado'
                    WHEN hr.estado_hoja = 'observado_tutor' THEN 'con_observacion'
                END AS clasificacion,
                COALESCE(hr.estado_hoja::text, 'pendiente_envio') AS estado_hoja,
                dr.hora_inicio_estimada
            FROM detalle_reserva dr
            INNER JOIN reserva r ON dr.id_reserva = r.id_reserva
            INNER JOIN paciente p ON r.id_paciente = p.id_paciente
            INNER JOIN sede s ON r.id_sede = s.id_sede
            LEFT JOIN hoja_ruta hr ON dr.id_detalle = hr.id_detalle
            WHERE r.id_instructor = :idInstructor
              AND dr.estado_detalle = 'aprobada'
              AND (hr.id_ruta IS NULL
                   OR hr.estado_hoja IN ('pendiente_envio', 'enviado_al_tutor', 'observado_tutor'))
            ORDER BY dr.hora_inicio_estimada ASC
            """, nativeQuery = true)
    List<Object[]> obtenerCardsClasificadas(@Param("idInstructor") Integer idInstructor);
}