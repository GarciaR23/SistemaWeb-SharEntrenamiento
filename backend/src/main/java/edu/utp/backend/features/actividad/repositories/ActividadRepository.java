package edu.utp.backend.features.actividad.repositories;

import edu.utp.backend.features.actividad.dtos.ActividadTutorDto;
import edu.utp.backend.features.actividad.dtos.AvanceEjercicioReporteDto;
import edu.utp.backend.features.actividad.dtos.PropuestaReprogramacionDto;
import edu.utp.backend.features.actividad.dtos.ReporteTecnicoDto;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ActividadRepository {

    private final JdbcTemplate jdbcTemplate;

    public List<ActividadTutorDto> listarPorTutor(Integer idTutor) {
        String sql = """
                SELECT
                    r.id_reserva,
                    dr.id_detalle,
                    se.id_sesion,

                    p.id_paciente,
                    i.id_instructor,
                    s.id_sede,

                    p.nombre_completo AS paciente_nombre,
                    p.edad AS paciente_edad,
                    p.url_imagen_paciente AS paciente_imagen,

                    i.nombre_completo AS instructor_nombre,
                    i.especialidad,

                    s.nombre_sede,
                    s.direccion_sede,

                    dr.hora_inicio_estimada,
                    dr.hora_fin_estimada,
                    CAST(EXTRACT(EPOCH FROM dr.duracion_entrenamiento) / 60 AS INTEGER) AS duracion_minutos,
                    dr.monto_subtotal,

                    dr.estado_detalle::text AS estado_detalle,
                    COALESCE(se.estado_sesion::text, 'programada') AS estado_sesion,
                    hr.estado_hoja::text AS estado_hoja,

                    CASE
                        WHEN hr.estado_hoja::text = 'aprobado_tutor'
                        THEN TRUE
                        ELSE FALSE
                    END AS hoja_ruta_aceptada,

                    CASE
                        WHEN pg.id_pago IS NOT NULL
                             AND pg.estado_pago::text = 'recibido'
                        THEN TRUE
                        ELSE FALSE
                    END AS pago_registrado,

                    rp.id_reprogramar,
                    rp.descripcion_motivo AS motivo_reprogramacion,
                    rp.respuesta_tutor,

                    ce.nombre_contacto AS contacto_emergencia_nombre,
                    ce.telefono AS contacto_emergencia_telefono,
                    ce.relacion AS contacto_emergencia_relacion,
                    pe.descripcion AS protocolo_emergencia

                FROM reserva r

                INNER JOIN detalle_reserva dr
                    ON dr.id_reserva = r.id_reserva

                INNER JOIN paciente p
                    ON p.id_paciente = r.id_paciente

                INNER JOIN tutor t
                    ON t.id_tutor = p.id_tutor

                INNER JOIN instructor i
                    ON i.id_instructor = r.id_instructor

                INNER JOIN sede s
                    ON s.id_sede = r.id_sede

                INNER JOIN hoja_ruta hr
                    ON hr.id_reserva = r.id_reserva
                   AND hr.id_detalle = dr.id_detalle

                LEFT JOIN sesion se
                    ON se.id_reserva = r.id_reserva
                   AND se.id_detalle = dr.id_detalle

                LEFT JOIN pago pg
                    ON pg.id_reserva = r.id_reserva

                LEFT JOIN contacto_emergencia ce
                    ON ce.id_paciente = p.id_paciente

                LEFT JOIN protocolo_emergencia pe
                    ON pe.id_paciente = p.id_paciente

                LEFT JOIN LATERAL (
                    SELECT
                        re.id_reprogramar,
                        re.descripcion_motivo,
                        re.respuesta_tutor
                    FROM reprogramacion re
                    WHERE re.id_sesion = se.id_sesion
                    ORDER BY re.id_reprogramar DESC
                    LIMIT 1
                ) rp ON TRUE

                WHERE t.id_tutor = ?
                  AND hr.estado_hoja IN (
                    'aprobado_tutor',
                    'enviado_al_tutor',
                    'observado_tutor'
                  )

                ORDER BY dr.hora_inicio_estimada DESC
                """;

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> {
                    Integer idReprogramar = obtenerEnteroNullable(rs.getObject("id_reprogramar"));

                    return new ActividadTutorDto(
                            rs.getInt("id_reserva"),
                            rs.getInt("id_detalle"),
                            obtenerEnteroNullable(rs.getObject("id_sesion")),

                            rs.getInt("id_paciente"),
                            rs.getInt("id_instructor"),
                            rs.getInt("id_sede"),

                            rs.getString("paciente_nombre"),
                            obtenerEnteroNullable(rs.getObject("paciente_edad")),
                            rs.getString("paciente_imagen"),

                            rs.getString("instructor_nombre"),
                            rs.getString("especialidad"),

                            rs.getString("nombre_sede"),
                            rs.getString("direccion_sede"),

                            obtenerFecha(rs.getTimestamp("hora_inicio_estimada")),
                            obtenerFecha(rs.getTimestamp("hora_fin_estimada")),
                            rs.getInt("duracion_minutos"),
                            rs.getBigDecimal("monto_subtotal"),

                            rs.getString("estado_detalle"),
                            rs.getString("estado_sesion"),
                            rs.getString("estado_hoja"),

                            rs.getBoolean("hoja_ruta_aceptada"),
                            rs.getBoolean("pago_registrado"),

                            idReprogramar,
                            rs.getString("motivo_reprogramacion"),
                            obtenerBooleanNullable(rs.getObject("respuesta_tutor")),

                            rs.getString("contacto_emergencia_nombre"),
                            rs.getString("contacto_emergencia_telefono"),
                            rs.getString("contacto_emergencia_relacion"),
                            rs.getString("protocolo_emergencia"),

                            idReprogramar == null
                                    ? List.of()
                                    : listarPropuestasReprogramacion(idReprogramar));
                },
                idTutor);
    }

    public ActividadTutorDto obtenerPorDetalle(Integer idDetalle) {
        String sql = """
                SELECT
                    r.id_reserva,
                    dr.id_detalle,
                    se.id_sesion,

                    r.id_paciente,
                    r.id_instructor,
                    r.id_sede,

                    p.nombre_completo AS paciente_nombre,
                    p.edad AS paciente_edad,
                    p.url_imagen_paciente AS paciente_imagen,

                    i.nombre_completo AS instructor_nombre,
                    i.especialidad,

                    sd.nombre_sede,
                    sd.direccion_sede,

                    dr.hora_inicio_estimada,
                    dr.hora_fin_estimada,
                    CAST(EXTRACT(EPOCH FROM dr.duracion_entrenamiento) / 60 AS INTEGER) AS duracion_minutos,
                    dr.monto_subtotal,

                    dr.estado_detalle::text AS estado_detalle,
                    COALESCE(se.estado_sesion::text, 'programada') AS estado_sesion,
                    COALESCE(hr.estado_hoja::text, 'sin_hoja') AS estado_hoja,

                    CASE
                        WHEN hr.estado_hoja::text = 'aprobado_tutor'
                        THEN TRUE
                        ELSE FALSE
                    END AS hoja_ruta_aceptada,

                    CASE
                        WHEN pg.id_pago IS NOT NULL
                             AND pg.estado_pago::text = 'recibido'
                        THEN TRUE
                        ELSE FALSE
                    END AS pago_registrado,

                    rp.id_reprogramar,
                    rp.descripcion_motivo AS motivo_reprogramacion,
                    rp.respuesta_tutor,

                    ce.nombre_contacto AS contacto_emergencia_nombre,
                    ce.telefono AS contacto_emergencia_telefono,
                    ce.relacion AS contacto_emergencia_relacion,
                    pe.descripcion AS protocolo_emergencia

                FROM detalle_reserva dr

                INNER JOIN reserva r
                    ON r.id_reserva = dr.id_reserva

                INNER JOIN paciente p
                    ON p.id_paciente = r.id_paciente

                INNER JOIN instructor i
                    ON i.id_instructor = r.id_instructor

                INNER JOIN sede sd
                    ON sd.id_sede = r.id_sede

                LEFT JOIN hoja_ruta hr
                    ON hr.id_reserva = r.id_reserva
                   AND hr.id_detalle = dr.id_detalle

                LEFT JOIN sesion se
                    ON se.id_reserva = r.id_reserva
                   AND se.id_detalle = dr.id_detalle

                LEFT JOIN pago pg
                    ON pg.id_reserva = r.id_reserva

                LEFT JOIN contacto_emergencia ce
                    ON ce.id_paciente = p.id_paciente

                LEFT JOIN protocolo_emergencia pe
                    ON pe.id_paciente = p.id_paciente

                LEFT JOIN LATERAL (
                    SELECT rp2.*
                    FROM reprogramacion rp2
                    WHERE rp2.id_sesion = se.id_sesion
                    ORDER BY rp2.id_reprogramar DESC
                    LIMIT 1
                ) rp ON TRUE

                WHERE dr.id_detalle = ?
                """;

        return jdbcTemplate.queryForObject(
                sql,
                (rs, rowNum) -> {
                    Integer idReprogramar = obtenerEnteroNullable(rs.getObject("id_reprogramar"));

                    return new ActividadTutorDto(
                            rs.getInt("id_reserva"),
                            rs.getInt("id_detalle"),
                            obtenerEnteroNullable(rs.getObject("id_sesion")),

                            rs.getInt("id_paciente"),
                            rs.getInt("id_instructor"),
                            rs.getInt("id_sede"),

                            rs.getString("paciente_nombre"),
                            obtenerEnteroNullable(rs.getObject("paciente_edad")),
                            rs.getString("paciente_imagen"),

                            rs.getString("instructor_nombre"),
                            rs.getString("especialidad"),

                            rs.getString("nombre_sede"),
                            rs.getString("direccion_sede"),

                            obtenerFecha(rs.getTimestamp("hora_inicio_estimada")),
                            obtenerFecha(rs.getTimestamp("hora_fin_estimada")),
                            rs.getInt("duracion_minutos"),
                            rs.getBigDecimal("monto_subtotal"),

                            rs.getString("estado_detalle"),
                            rs.getString("estado_sesion"),
                            rs.getString("estado_hoja"),

                            rs.getBoolean("hoja_ruta_aceptada"),
                            rs.getBoolean("pago_registrado"),

                            idReprogramar,
                            rs.getString("motivo_reprogramacion"),
                            obtenerBooleanNullable(rs.getObject("respuesta_tutor")),

                            rs.getString("contacto_emergencia_nombre"),
                            rs.getString("contacto_emergencia_telefono"),
                            rs.getString("contacto_emergencia_relacion"),
                            rs.getString("protocolo_emergencia"),

                            idReprogramar == null
                                    ? List.of()
                                    : listarPropuestasReprogramacion(idReprogramar));
                },
                idDetalle);
    }

    public ActividadTutorDto obtenerPorSesion(Integer idSesion) {
        Integer idDetalle = jdbcTemplate.queryForObject(
                """
                        SELECT id_detalle
                        FROM sesion
                        WHERE id_sesion = ?
                        """,
                Integer.class,
                idSesion);

        if (idDetalle == null) {
            throw new IllegalStateException("No se encontró el detalle de la sesión.");
        }

        return obtenerPorDetalle(idDetalle);
    }

    public List<PropuestaReprogramacionDto> listarPropuestasReprogramacion(Integer idReprogramar) {
        String sql = """
                SELECT
                    id_detalle_reprogramar,
                    id_reprogramar,
                    fecha_propuesta,
                    hora_inicio_propuesta,
                    hora_fin_propuesta,
                    es_seleccionada
                FROM detalle_reprogramacion
                WHERE id_reprogramar = ?
                ORDER BY fecha_propuesta, hora_inicio_propuesta
                """;

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> new PropuestaReprogramacionDto(
                        rs.getInt("id_detalle_reprogramar"),
                        rs.getInt("id_reprogramar"),
                        rs.getObject("fecha_propuesta", LocalDate.class),
                        rs.getObject("hora_inicio_propuesta", LocalTime.class),
                        rs.getObject("hora_fin_propuesta", LocalTime.class),
                        rs.getBoolean("es_seleccionada")),
                idReprogramar);
    }

    public boolean existeSesionPorDetalle(Integer idDetalle) {
        Integer total = jdbcTemplate.queryForObject(
                """
                        SELECT COUNT(*)
                        FROM sesion
                        WHERE id_detalle = ?
                        """,
                Integer.class,
                idDetalle);

        return total != null && total > 0;
    }

    public void crearSesionEnCurso(Integer idReserva, Integer idDetalle) {
        jdbcTemplate.update(
                """
                        INSERT INTO sesion (
                            id_reserva,
                            estado_sesion,
                            fecha_actualizacion,
                            id_detalle
                        )
                        VALUES (
                            ?,
                            'en_curso'::estado_sesion_enum,
                            CURRENT_TIMESTAMP,
                            ?
                        )
                        """,
                idReserva,
                idDetalle);
    }

    public void actualizarSesionEnCurso(Integer idDetalle) {
        jdbcTemplate.update(
                """
                        UPDATE sesion
                        SET estado_sesion = 'en_curso'::estado_sesion_enum,
                            fecha_actualizacion = CURRENT_TIMESTAMP
                        WHERE id_detalle = ?
                        """,
                idDetalle);
    }

    public void registrarAsistenciaPin(Integer idSesion, String pin) {
        jdbcTemplate.update(
                """
                        INSERT INTO asistencia_pin (
                            id_sesion,
                            pin_validacion,
                            completado_exito,
                            fecha_confirmacion
                        )
                        VALUES (
                            ?,
                            ?,
                            TRUE,
                            CURRENT_TIMESTAMP
                        )
                        """,
                idSesion,
                pin);
    }

    public void finalizarSesion(Integer idSesion) {
        jdbcTemplate.update(
                """
                        UPDATE sesion
                        SET estado_sesion = 'finalizado'::estado_sesion_enum,
                            fecha_actualizacion = CURRENT_TIMESTAMP
                        WHERE id_sesion = ?
                        """,
                idSesion);
    }

    public void marcarSesionReprogramada(Integer idSesion) {
        jdbcTemplate.update(
                """
                        UPDATE sesion
                        SET estado_sesion = 'reprogramada'::estado_sesion_enum,
                            fecha_actualizacion = CURRENT_TIMESTAMP
                        WHERE id_sesion = ?
                        """,
                idSesion);
    }

    public Integer registrarIncidencia(
            Integer idSesion,
            Integer idPaciente,
            Integer idInstructor,
            String motivo,
            String descripcion) {
        return jdbcTemplate.queryForObject(
                """
                        INSERT INTO incidencia (
                            id_paciente,
                            id_instructor,
                            id_sesion,
                            motivo_incidencia,
                            descripcion_incidencia,
                            fecha_incidencia
                        )
                        VALUES (
                            ?,
                            ?,
                            ?,
                            ?::motivo_incidencia_enum,
                            ?,
                            CURRENT_TIMESTAMP
                        )
                        RETURNING id_incidencia
                        """,
                Integer.class,
                idPaciente,
                idInstructor,
                idSesion,
                motivo,
                descripcion);
    }

    public void registrarDetalleIncidencia(
            Integer idIncidencia,
            String nivelGravedad,
            String url1,
            String url2,
            String url3,
            String accionSugerida) {
        jdbcTemplate.update(
                """
                        INSERT INTO detalle_incidencia (
                            id_incidencia,
                            nivel_gravedad,
                            url_evidencia_1,
                            url_evidencia_2,
                            url_evidencia_3,
                            accion_sugerida
                        )
                        VALUES (
                            ?,
                            ?::nivel_gravedad_enum,
                            ?,
                            ?,
                            ?,
                            ?::tipo_accion
                        )
                        """,
                idIncidencia,
                nivelGravedad,
                url1,
                url2,
                url3,
                accionSugerida);
    }

    public boolean existeReprogramacionPendiente(Integer idSesion) {
        Integer total = jdbcTemplate.queryForObject(
                """
                        SELECT COUNT(*)
                        FROM reprogramacion
                        WHERE id_sesion = ?
                          AND respuesta_tutor IS NULL
                        """,
                Integer.class,
                idSesion);

        return total != null && total > 0;
    }

    public Integer crearReprogramacion(Integer idSesion, String descripcion) {
        return jdbcTemplate.queryForObject(
                """
                        INSERT INTO reprogramacion (
                            id_sesion,
                            motivo,
                            descripcion_motivo,
                            respuesta_tutor,
                            fecha_respuesta,
                            fecha_creacion
                        )
                        VALUES (
                            ?,
                            'indisponibilidad_instructor'::motivo_reprogramar_enum,
                            ?,
                            NULL,
                            NULL,
                            CURRENT_TIMESTAMP
                        )
                        RETURNING id_reprogramar
                        """,
                Integer.class,
                idSesion,
                descripcion);
    }

    public void crearPropuestasReprogramacion(Integer idReprogramar, LocalDateTime inicioBase) {
        jdbcTemplate.update(
                """
                        INSERT INTO detalle_reprogramacion (
                            id_reprogramar,
                            fecha_propuesta,
                            hora_inicio_propuesta,
                            hora_fin_propuesta,
                            es_seleccionada
                        )
                        VALUES
                        (
                            ?,
                            ?,
                            ?,
                            ?,
                            FALSE
                        ),
                        (
                            ?,
                            ?,
                            ?,
                            ?,
                            FALSE
                        )
                        """,
                idReprogramar,
                inicioBase.toLocalDate().plusDays(1),
                inicioBase.toLocalTime(),
                inicioBase.toLocalTime().plusHours(1),

                idReprogramar,
                inicioBase.toLocalDate().plusDays(3),
                inicioBase.toLocalTime(),
                inicioBase.toLocalTime().plusHours(1));
    }

    public PropuestaReprogramacionDto obtenerPropuesta(Integer idDetalleReprogramar) {
        String sql = """
                SELECT
                    id_detalle_reprogramar,
                    id_reprogramar,
                    fecha_propuesta,
                    hora_inicio_propuesta,
                    hora_fin_propuesta,
                    es_seleccionada
                FROM detalle_reprogramacion
                WHERE id_detalle_reprogramar = ?
                """;

        return jdbcTemplate.queryForObject(
                sql,
                (rs, rowNum) -> new PropuestaReprogramacionDto(
                        rs.getInt("id_detalle_reprogramar"),
                        rs.getInt("id_reprogramar"),
                        rs.getObject("fecha_propuesta", LocalDate.class),
                        rs.getObject("hora_inicio_propuesta", LocalTime.class),
                        rs.getObject("hora_fin_propuesta", LocalTime.class),
                        rs.getBoolean("es_seleccionada")),
                idDetalleReprogramar);
    }

    public void aceptarReprogramacion(Integer idReprogramar, Integer idDetalleReprogramar) {
        jdbcTemplate.update(
                """
                        UPDATE detalle_reprogramacion
                        SET es_seleccionada = FALSE
                        WHERE id_reprogramar = ?
                        """,
                idReprogramar);

        jdbcTemplate.update(
                """
                        UPDATE detalle_reprogramacion
                        SET es_seleccionada = TRUE
                        WHERE id_detalle_reprogramar = ?
                        """,
                idDetalleReprogramar);

        jdbcTemplate.update(
                """
                        UPDATE reprogramacion
                        SET respuesta_tutor = TRUE,
                            fecha_respuesta = CURRENT_TIMESTAMP
                        WHERE id_reprogramar = ?
                        """,
                idReprogramar);
    }

    public void actualizarHorarioDetalle(
            Integer idDetalle,
            LocalDateTime nuevoInicio,
            LocalDateTime nuevoFin) {
        jdbcTemplate.update(
                """
                        UPDATE detalle_reserva
                        SET hora_inicio_estimada = ?,
                            hora_fin_estimada = ?,
                            estado_detalle = 'aprobada'::estado_reserva_enum,
                            fecha_revision = CURRENT_TIMESTAMP
                        WHERE id_detalle = ?
                        """,
                nuevoInicio,
                nuevoFin,
                idDetalle);
    }

    public void ponerSesionPendiente(Integer idSesion) {
        jdbcTemplate.update(
                """
                        UPDATE sesion
                        SET estado_sesion = 'pendiente'::estado_sesion_enum,
                            fecha_actualizacion = CURRENT_TIMESTAMP
                        WHERE id_sesion = ?
                        """,
                idSesion);
    }

    public boolean existePago(Integer idReserva) {
        Integer total = jdbcTemplate.queryForObject(
                """
                        SELECT COUNT(*)
                        FROM pago
                        WHERE id_reserva = ?
                        """,
                Integer.class,
                idReserva);

        return total != null && total > 0;
    }

    public void registrarPago(
            Integer idReserva,
            Integer idPaciente,
            Integer idInstructor,
            BigDecimal monto) {
        jdbcTemplate.update(
                """
                        INSERT INTO pago (
                            id_reserva,
                            id_paciente,
                            id_instructor,
                            monto_total,
                            metodo_pago,
                            fecha_pago,
                            estado_pago
                        )
                        VALUES (
                            ?,
                            ?,
                            ?,
                            ?,
                            'tarjeta_credito',
                            CURRENT_TIMESTAMP,
                            'recibido'::estado_pago_enum
                        )
                        """,
                idReserva,
                idPaciente,
                idInstructor,
                monto);
    }

    public void actualizarPagoRecibido(Integer idReserva) {
        jdbcTemplate.update(
                """
                        UPDATE pago
                        SET metodo_pago = 'tarjeta_credito',
                            fecha_pago = CURRENT_TIMESTAMP,
                            estado_pago = 'recibido'::estado_pago_enum
                        WHERE id_reserva = ?
                        """,
                idReserva);
    }

    public boolean existeCalificacionPorSesion(Integer idSesion) {
        Integer total = jdbcTemplate.queryForObject(
                """
                        SELECT COUNT(*)
                        FROM calificacion_servicio
                        WHERE id_sesion = ?
                        """,
                Integer.class,
                idSesion);

        return total != null && total > 0;
    }

    public void registrarCalificacionServicio(
            Integer idPaciente,
            Integer idInstructor,
            Integer idSesion,
            Integer puntajeEstrellas,
            String comentarioTutor) {
        jdbcTemplate.update(
                """
                        INSERT INTO calificacion_servicio (
                            id_paciente,
                            id_instructor,
                            puntaje_estrellas,
                            comentario_tutor,
                            fecha_calificacion,
                            id_sesion
                        )
                        VALUES (
                            ?,
                            ?,
                            ?,
                            ?,
                            CURRENT_TIMESTAMP,
                            ?
                        )
                        """,
                idPaciente,
                idInstructor,
                puntajeEstrellas,
                comentarioTutor,
                idSesion);
    }

    public void actualizarCalificacionServicio(
            Integer idSesion,
            Integer puntajeEstrellas,
            String comentarioTutor) {
        jdbcTemplate.update(
                """
                        UPDATE calificacion_servicio
                        SET puntaje_estrellas = ?,
                            comentario_tutor = ?,
                            fecha_calificacion = CURRENT_TIMESTAMP
                        WHERE id_sesion = ?
                        """,
                puntajeEstrellas,
                comentarioTutor,
                idSesion);
    }

    public Optional<ReporteTecnicoDto> obtenerReportePorReserva(Integer idReserva) {
        String sql = """
                SELECT
                    rr.id_reporte,
                    rr.id_reserva,
                    rr.id_paciente,
                    rr.hora_inicio_real,
                    rr.hora_final_real,
                    rr.respuesta_auditiva::text AS respuesta_auditiva,
                    rr.respuesta_visual::text AS respuesta_visual,
                    rr.compromiso_sesion,
                    rr.puntaje_coordinacion,
                    rr.puntaje_equilibrio,
                    rr.puntaje_resistencia,
                    rr.observacion_tecnica,
                    rr.recommendaciones,
                    rr.fecha_registro,

                    EXISTS (
                        SELECT 1
                        FROM incidencia inc
                        INNER JOIN sesion se
                            ON se.id_sesion = inc.id_sesion
                        WHERE se.id_reserva = rr.id_reserva
                          AND inc.motivo_incidencia::text = 'colapso_paciente'
                    ) AS tuvo_colapso,

                    (
                        SELECT inc.descripcion_incidencia
                        FROM incidencia inc
                        INNER JOIN sesion se
                            ON se.id_sesion = inc.id_sesion
                        WHERE se.id_reserva = rr.id_reserva
                          AND inc.motivo_incidencia::text = 'colapso_paciente'
                        ORDER BY inc.fecha_incidencia DESC
                        LIMIT 1
                    ) AS descripcion_colapso,

                    (
                        SELECT 'Minuto ' || GREATEST(
                            1,
                            CAST(
                                EXTRACT(
                                    EPOCH FROM (
                                        inc.fecha_incidencia
                                        - (rr.fecha_registro::date + rr.hora_inicio_real)
                                    )
                                ) / 60 AS INTEGER
                            )
                        )
                        FROM incidencia inc
                        INNER JOIN sesion se
                            ON se.id_sesion = inc.id_sesion
                        WHERE se.id_reserva = rr.id_reserva
                          AND inc.motivo_incidencia::text = 'colapso_paciente'
                        ORDER BY inc.fecha_incidencia DESC
                        LIMIT 1
                    ) AS minuto_colapso

                FROM reporte_rendimiento_paciente rr
                WHERE rr.id_reserva = ?
                ORDER BY rr.fecha_registro DESC
                LIMIT 1
                """;

        List<ReporteTecnicoDto> resultados = jdbcTemplate.query(
                sql,
                (rs, rowNum) -> {
                    Integer idReporte = rs.getInt("id_reporte");

                    return new ReporteTecnicoDto(
                            idReporte,
                            rs.getInt("id_reserva"),
                            rs.getInt("id_paciente"),
                            rs.getObject("hora_inicio_real", LocalTime.class),
                            rs.getObject("hora_final_real", LocalTime.class),
                            rs.getString("respuesta_auditiva"),
                            rs.getString("respuesta_visual"),
                            rs.getInt("compromiso_sesion"),
                            obtenerEnteroNullable(rs.getObject("puntaje_coordinacion")),
                            obtenerEnteroNullable(rs.getObject("puntaje_equilibrio")),
                            obtenerEnteroNullable(rs.getObject("puntaje_resistencia")),
                            rs.getString("observacion_tecnica"),
                            rs.getString("recommendaciones"),
                            obtenerFecha(rs.getTimestamp("fecha_registro")),
                            rs.getBoolean("tuvo_colapso"),
                            rs.getString("descripcion_colapso"),
                            rs.getString("minuto_colapso"),
                            listarEjerciciosReporte(idReporte));
                },
                idReserva);

        return resultados.stream().findFirst();
    }

    public List<AvanceEjercicioReporteDto> listarEjerciciosReporte(Integer idReporte) {
        String sql = """
                SELECT
                    dr.id_detalle AS id_detalle_rutina,
                    dr.nombre_ejercicio,
                    dr.tipo_ejercicio::text AS tipo_ejercicio,
                    dr.descripcion_ejercicio,
                    aer.estado_ejercicio::text AS estado_ejercicio
                FROM avance_ejercicio_reporte aer
                INNER JOIN detalle_rutina dr
                    ON dr.id_detalle = aer.id_detalle_rutina
                WHERE aer.id_reporte = ?
                ORDER BY dr.id_detalle
                """;

        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> new AvanceEjercicioReporteDto(
                        rs.getInt("id_detalle_rutina"),
                        rs.getString("nombre_ejercicio"),
                        rs.getString("tipo_ejercicio"),
                        rs.getString("descripcion_ejercicio"),
                        rs.getString("estado_ejercicio")),
                idReporte);
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