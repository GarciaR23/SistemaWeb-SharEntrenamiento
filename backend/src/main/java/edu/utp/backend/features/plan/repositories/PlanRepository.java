package edu.utp.backend.features.plan.repositories;

import edu.utp.backend.features.plan.dtos.AjusteHojaRutaDto;
import edu.utp.backend.features.plan.dtos.AjusteHojaRutaRequest;
import edu.utp.backend.features.plan.dtos.DetalleRutinaPlanDto;
import edu.utp.backend.features.plan.dtos.PlanTutorDto;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class PlanRepository {

    private final JdbcTemplate jdbcTemplate;

    public PlanTutorDto obtenerPlanPorReserva(Integer idReserva) {
        String sql = """
                SELECT
                    r.id_reserva,
                    hr.id_ruta,
                    dr.id_detalle,

                    p.id_paciente,
                    p.nombre_completo AS paciente_nombre,

                    i.id_instructor,
                    i.nombre_completo AS instructor_nombre,
                    i.especialidad,
                    i.url_imagen_perfil AS imagen_instructor,

                    s.id_sede,
                    s.nombre_sede,
                    s.descripcion_sede,
                    s.direccion_sede,
                    s.distrito_sede,
                    s.zona_sede::text AS zona_sede,
                    s.url_imagen_sede_1,
                    s.url_imagen_sede_2,
                    s.url_imagen_sede_3,

                    dr.hora_inicio_estimada,
                    dr.hora_fin_estimada,
                    dr.estado_detalle::text AS estado_detalle,
                    hr.estado_hoja::text AS estado_hoja,

                    COALESCE(se.estado_sesion::text, 'sin_sesion') AS estado_sesion,

                    CASE
                        WHEN pg.id_pago IS NOT NULL
                             AND pg.estado_pago::text = 'recibido'
                        THEN TRUE
                        ELSE FALSE
                    END AS pago_registrado

                FROM reserva r

                INNER JOIN detalle_reserva dr
                    ON dr.id_reserva = r.id_reserva

                INNER JOIN hoja_ruta hr
                    ON hr.id_reserva = r.id_reserva
                   AND hr.id_detalle = dr.id_detalle

                INNER JOIN paciente p
                    ON p.id_paciente = r.id_paciente

                INNER JOIN instructor i
                    ON i.id_instructor = r.id_instructor

                INNER JOIN sede s
                    ON s.id_sede = r.id_sede

                LEFT JOIN sesion se
                    ON se.id_reserva = r.id_reserva

                LEFT JOIN pago pg
                    ON pg.id_reserva = r.id_reserva

                WHERE r.id_reserva = ?
                ORDER BY hr.id_ruta DESC
                LIMIT 1
                """;

        return jdbcTemplate.queryForObject(
                sql,
                (rs, rowNum) -> {
                    Integer idRuta = rs.getInt("id_ruta");

                    List<String> imagenes = new ArrayList<>();

                    String imagen1 = rs.getString("url_imagen_sede_1");
                    String imagen2 = rs.getString("url_imagen_sede_2");
                    String imagen3 = rs.getString("url_imagen_sede_3");

                    if (imagen1 != null && !imagen1.isBlank()) {
                        imagenes.add(imagen1);
                    }

                    if (imagen2 != null && !imagen2.isBlank()) {
                        imagenes.add(imagen2);
                    }

                    if (imagen3 != null && !imagen3.isBlank()) {
                        imagenes.add(imagen3);
                    }

                    return new PlanTutorDto(
                            rs.getInt("id_reserva"),
                            idRuta,
                            rs.getInt("id_detalle"),

                            rs.getInt("id_paciente"),
                            rs.getString("paciente_nombre"),

                            rs.getInt("id_instructor"),
                            rs.getString("instructor_nombre"),
                            rs.getString("especialidad"),
                            rs.getString("imagen_instructor"),

                            rs.getInt("id_sede"),
                            rs.getString("nombre_sede"),
                            rs.getString("descripcion_sede"),
                            rs.getString("direccion_sede"),
                            rs.getString("distrito_sede"),
                            rs.getString("zona_sede"),

                            obtenerFecha(rs.getTimestamp("hora_inicio_estimada")),
                            obtenerFecha(rs.getTimestamp("hora_fin_estimada")),

                            rs.getString("estado_hoja"),
                            rs.getString("estado_detalle"),
                            rs.getString("estado_sesion"),
                            rs.getBoolean("pago_registrado"),

                            imagenes,
                            listarEjercicios(idRuta),
                            listarAjustes(idRuta));
                },
                idReserva);
    }

    public List<DetalleRutinaPlanDto> listarEjercicios(Integer idRuta) {
        String sql = """
                SELECT
                    dr.id_detalle AS id_detalle_rutina,
                    dr.nombre_ejercicio,
                    dr.tipo_ejercicio::text AS tipo_ejercicio,
                    dr.descripcion_ejercicio,
                    CAST(EXTRACT(EPOCH FROM dr.duracion_estimada) / 60 AS INTEGER) AS duracion_estimada
                FROM detalle_rutina dr
                WHERE dr.id_ruta = ?
                ORDER BY dr.id_detalle
                """;

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> new DetalleRutinaPlanDto(
                        rs.getInt("id_detalle_rutina"),
                        rs.getString("nombre_ejercicio"),
                        rs.getString("tipo_ejercicio"),
                        rs.getString("descripcion_ejercicio"),
                        obtenerEnteroNullable(rs.getObject("duracion_estimada"))),
                idRuta);
    }

    public List<AjusteHojaRutaDto> listarAjustes(Integer idRuta) {
        String sql = """
                SELECT
                    ahr.id_ajuste,
                    ahr.id_ruta,
                    ahr.id_ejercicio_original,
                    dr.nombre_ejercicio AS nombre_ejercicio_original,
                    ahr.motivo_cambio::text AS motivo_cambio,
                    ahr.motivo_detallado,
                    NULL::text AS ejercicio_modificado,
                    NULL::text AS comentario_supervisor,
                    ahr.autorizado_por_instructor,
                    ahr.fecha_ajuste
                FROM ajuste_hoja_ruta ahr
                LEFT JOIN detalle_rutina dr
                    ON dr.id_detalle = ahr.id_ejercicio_original
                WHERE ahr.id_ruta = ?
                ORDER BY ahr.fecha_ajuste DESC
                """;

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> new AjusteHojaRutaDto(
                        rs.getInt("id_ajuste"),
                        rs.getInt("id_ruta"),
                        obtenerEnteroNullable(rs.getObject("id_ejercicio_original")),
                        rs.getString("nombre_ejercicio_original"),
                        rs.getString("motivo_cambio"),
                        rs.getString("motivo_detallado"),
                        rs.getString("ejercicio_modificado"),
                        rs.getString("comentario_supervisor"),
                        obtenerBooleanNullable(rs.getObject("autorizado_por_instructor")),
                        obtenerFecha(rs.getTimestamp("fecha_ajuste"))),
                idRuta);
    }

    public void marcarComoVisto(Integer idRuta) {
        jdbcTemplate.update(
                """
                        UPDATE hoja_ruta
                        SET estado_hoja = 'visto_tutor'::tipo_estado_hoja,
                            fecha_actualizacion = CURRENT_TIMESTAMP
                        WHERE id_ruta = ?
                          AND estado_hoja::text = 'enviado_al_tutor'
                        """,
                idRuta);
    }

    public void registrarAjuste(Integer idRuta, AjusteHojaRutaRequest request) {
        jdbcTemplate.update(
                """
                        INSERT INTO ajuste_hoja_ruta (
                            id_ruta,
                            id_ejercicio_original,
                            motivo_cambio,
                            motivo_detallado,
                            autorizado_por_instructor,
                            fecha_ajuste
                        )
                        VALUES (
                            ?,
                            ?,
                            ?::tipo_motivo_ajuste,
                            ?,
                            FALSE,
                            CURRENT_TIMESTAMP
                        )
                        """,
                idRuta,
                request.idEjercicioOriginal(),
                request.motivoCambio(),
                request.motivoDetallado() + "\nPropuesta del tutor: " + request.ejercicioModificado());

        jdbcTemplate.update(
                """
                        UPDATE hoja_ruta
                        SET estado_hoja = 'observado_tutor'::tipo_estado_hoja,
                            fecha_actualizacion = CURRENT_TIMESTAMP
                        WHERE id_ruta = ?
                        """,
                idRuta);
    }

    public void aceptarHojaRuta(Integer idRuta) {
        jdbcTemplate.update(
                """
                        UPDATE hoja_ruta
                        SET estado_hoja = 'aprobado_tutor'::tipo_estado_hoja,
                            fecha_actualizacion = CURRENT_TIMESTAMP
                        WHERE id_ruta = ?
                        """,
                idRuta);
    }

    public void activarDetalleReserva(Integer idRuta) {
        jdbcTemplate.update(
                """
                        UPDATE detalle_reserva
                        SET estado_detalle = 'aprobada'::estado_reserva_enum,
                            fecha_revision = CURRENT_TIMESTAMP
                        WHERE id_detalle = (
                            SELECT id_detalle
                            FROM hoja_ruta
                            WHERE id_ruta = ?
                        )
                        """,
                idRuta);
    }

    public List<PlanTutorDto> listarPlanesPorTutor(Integer idTutor) {
        String sql = """
                SELECT
                    r.id_reserva
                FROM reserva r

                INNER JOIN detalle_reserva dr
                    ON dr.id_reserva = r.id_reserva

                INNER JOIN hoja_ruta hr
                    ON hr.id_reserva = r.id_reserva
                   AND hr.id_detalle = dr.id_detalle

                INNER JOIN paciente p
                    ON p.id_paciente = r.id_paciente

                INNER JOIN tutor t
                    ON t.id_tutor = p.id_tutor

                WHERE t.id_tutor = ?

                ORDER BY dr.hora_inicio_estimada DESC
                """;

        List<Integer> idsReserva = jdbcTemplate.query(
                sql,
                (rs, rowNum) -> rs.getInt("id_reserva"),
                idTutor);

        return idsReserva
                .stream()
                .map(this::obtenerPlanPorReserva)
                .toList();
    }

    private Integer obtenerEnteroNullable(Object valor) {
        if (valor == null) {
            return null;
        }

        return ((Number) valor).intValue();
    }

    private Boolean obtenerBooleanNullable(Object valor) {
        if (valor == null) {
            return null;
        }

        return (Boolean) valor;
    }

    private LocalDateTime obtenerFecha(Timestamp timestamp) {
        if (timestamp == null) {
            return null;
        }

        return timestamp.toLocalDateTime();
    }
}