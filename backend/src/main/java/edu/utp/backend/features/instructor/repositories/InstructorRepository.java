package edu.utp.backend.features.instructor.repositories;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import edu.utp.backend.features.instructor.entities.Instructor;
import edu.utp.backend.features.instructor.projections.InstructorPerfilCalificacionProjection;
import edu.utp.backend.features.instructor.projections.InstructorPerfilResumenProjection;
import edu.utp.backend.features.instructor.projections.InstructorPerfilSedeProjection;
import edu.utp.backend.features.instructor.projections.InstructorPerfilServicioProjection;

public interface InstructorRepository extends JpaRepository<Instructor, Integer> {

    Optional<Instructor> findByIdUsuario(Long idUsuario);

    @Query(value = """
                        SELECT
                            i.id_instructor AS idInstructor,
                            i.nombre_completo AS nombreCompleto,
                            i.url_imagen_perfil AS urlImagenPerfil,
                            i.especialidad AS especialidad,
                            i.biografia_instructor AS biografia,
                            i.distrito AS distrito,
                            i.direccion AS direccion,

                            s_principal.id_sede AS idSede,
                            s_principal.direccion_sede AS direccionSede,
                            s_principal.distrito_sede AS distritoSede,

                            (
                                SELECT COUNT(*)
                                FROM sede sx
                                WHERE sx.id_instructor = i.id_instructor
                                  AND COALESCE(sx.estado_activacion, true) = true
                            ) AS totalSedes,

                            servicio_principal.tarifa_hora AS tarifaHora,

                            hd.horario_preferencia AS horarioPreferencia,
                            hd.dia_semana AS diaSemana,
                            hd.horario_inicio AS horarioInicio,
                            hd.horario_final AS horarioFinal,

            (
                SELECT COALESCE(ROUND(AVG(cs.puntaje_estrellas), 1), 0)
                FROM calificacion_servicio cs
                INNER JOIN reserva r
                    ON r.id_reserva = cs.id_reserva
                WHERE cs.id_instructor = i.id_instructor
                  AND EXISTS (
                      SELECT 1
                      FROM sesion s
                      WHERE s.id_reserva = r.id_reserva
                        AND CAST(s.estado_sesion AS text) = 'finalizado'
                  )
            ) AS promedioCalificacion,

                            (
                                SELECT COUNT(DISTINCT s.id_sesion)
                                FROM reserva r
                                INNER JOIN sesion s
                                    ON s.id_reserva = r.id_reserva
                                WHERE r.id_instructor = i.id_instructor
                                  AND CAST(s.estado_sesion AS text) = 'finalizado'
                            ) AS totalSesiones

                        FROM instructor i

                        INNER JOIN usuario u
                            ON u.id_usuario = i.id_usuario

                        LEFT JOIN LATERAL (
                            SELECT
                                s.id_sede,
                                s.direccion_sede,
                                s.distrito_sede
                            FROM sede s
                            WHERE s.id_instructor = i.id_instructor
                              AND COALESCE(s.estado_activacion, true) = true
                            ORDER BY s.id_sede ASC
                            LIMIT 1
                        ) s_principal ON true

                        LEFT JOIN LATERAL (
                            SELECT
                                si.id_servicio,
                                si.tarifa_hora
                            FROM servicio_instructor si
                            WHERE si.id_instructor = i.id_instructor
                            ORDER BY si.tarifa_hora ASC NULLS LAST
                            LIMIT 1
                        ) servicio_principal ON true

                        LEFT JOIN horario_disponibilidad hd
                            ON servicio_principal.id_servicio = hd.id_servicio

                        WHERE u.estado_cuenta = 'activo'

                          AND (
                                SELECT COUNT(*)
                                FROM sede sx
                                WHERE sx.id_instructor = i.id_instructor
                                  AND COALESCE(sx.estado_activacion, true) = true
                              ) >= 3

                          AND (
                                :texto IS NULL
                                OR LOWER(i.nombre_completo) LIKE LOWER(CONCAT('%', :texto, '%'))
                                OR LOWER(COALESCE(i.especialidad, '')) LIKE LOWER(CONCAT('%', :texto, '%'))
                                OR LOWER(COALESCE(i.biografia_instructor, '')) LIKE LOWER(CONCAT('%', :texto, '%'))
                              )

                          AND (
                                :distrito IS NULL
                                OR LOWER(i.distrito) = LOWER(:distrito)
                                OR EXISTS (
                                    SELECT 1
                                    FROM sede sd
                                    WHERE sd.id_instructor = i.id_instructor
                                      AND LOWER(sd.distrito_sede) = LOWER(:distrito)
                                      AND COALESCE(sd.estado_activacion, true) = true
                                )
                              )

                          AND (
                                :especialidad IS NULL
                                OR LOWER(COALESCE(i.especialidad, '')) LIKE LOWER(CONCAT('%', :especialidad, '%'))
                              )

                          AND (
                                (:tarifaMin IS NULL AND :tarifaMax IS NULL)
                                OR EXISTS (
                                    SELECT 1
                                    FROM servicio_instructor sif
                                    WHERE sif.id_instructor = i.id_instructor
                                      AND (:tarifaMin IS NULL OR sif.tarifa_hora >= :tarifaMin)
                                      AND (:tarifaMax IS NULL OR sif.tarifa_hora <= :tarifaMax)
                                )
                              )

                          AND (
                                :turno IS NULL
                                OR EXISTS (
                                    SELECT 1
                                    FROM horario_disponibilidad hdf
                                    WHERE hdf.id_servicio = servicio_principal.id_servicio
                                      AND LOWER(CAST(hdf.horario_preferencia AS text)) = LOWER(:turno)
                                )
                              )

                        ORDER BY i.nombre_completo ASC
                        """, nativeQuery = true)
    List<InstructorBusquedaProjection> buscarInstructoresParaTutor(
            @Param("texto") String texto,
            @Param("distrito") String distrito,
            @Param("especialidad") String especialidad,
            @Param("tarifaMin") BigDecimal tarifaMin,
            @Param("tarifaMax") BigDecimal tarifaMax,
            @Param("turno") String turno);

    @Query(value = """
            SELECT
                i.id_instructor AS idInstructor,
                i.nombre_completo AS nombreCompleto,
                i.url_imagen_perfil AS urlImagenPerfil,
                i.especialidad AS especialidad,
                i.biografia_instructor AS biografia,
                i.direccion AS direccion,
                i.distrito AS distrito
            FROM instructor i
            WHERE i.id_instructor = :idInstructor
            """, nativeQuery = true)
    InstructorPerfilResumenProjection obtenerPerfilResumen(
            @Param("idInstructor") Integer idInstructor);

    @Query(value = """
            SELECT
                s.id_sede AS idSede,
                s.url_imagen_sede_1 AS urlImagenSede1,
                s.url_imagen_sede_2 AS urlImagenSede2,
                s.url_imagen_sede_3 AS urlImagenSede3,
                s.nombre_sede AS nombreSede,
                s.descripcion_sede AS descripcionSede,
                s.direccion_sede AS direccionSede,
                s.distrito_sede AS distritoSede,
                s.zona_sede AS zonaSede,
                s.estado_activacion AS estadoActivacion
            FROM sede s
            WHERE s.id_instructor = :idInstructor
            ORDER BY s.id_sede ASC
            """, nativeQuery = true)
    List<InstructorPerfilSedeProjection> obtenerPerfilSedes(
            @Param("idInstructor") Integer idInstructor);

    @Query(value = """
            SELECT
                si.id_servicio AS idServicio,
                si.tarifa_hora AS tarifaHora,
                hd.horario_preferencia AS horarioPreferencia,
                hd.dia_semana AS diaSemana,
                hd.horario_inicio AS horarioInicio,
                hd.horario_final AS horarioFinal
            FROM servicio_instructor si
            INNER JOIN horario_disponibilidad hd
                ON si.id_servicio = hd.id_servicio
            WHERE si.id_instructor = :idInstructor
            ORDER BY CASE hd.dia_semana
                WHEN 'Lunes' THEN 1
                WHEN 'Martes' THEN 2
                WHEN 'Miércoles' THEN 3
                WHEN 'Jueves' THEN 4
                WHEN 'Viernes' THEN 5
                WHEN 'Sábado' THEN 6
                WHEN 'Domingo' THEN 7
                ELSE 8
            END,
            hd.horario_inicio ASC
            """, nativeQuery = true)
    List<InstructorPerfilServicioProjection> obtenerPerfilServicios(
            @Param("idInstructor") Integer idInstructor);

    @Query(value = """
            SELECT
                cs.id_calificacion AS idCalificacion,
                cs.id_paciente AS idPaciente,
                p.nombre_completo AS pacienteNombre,
                cs.puntaje_estrellas AS puntajeEstrellas,
                cs.comentario_tutor AS comentarioTutor,
                cs.fecha_calificacion AS fechaCalificacion
            FROM calificacion_servicio cs
            INNER JOIN paciente p
                ON p.id_paciente = cs.id_paciente
            INNER JOIN reserva r
                ON r.id_reserva = cs.id_reserva
            WHERE cs.id_instructor = :idInstructor
              AND EXISTS (
                  SELECT 1
                  FROM sesion s
                  WHERE s.id_reserva = r.id_reserva
                    AND CAST(s.estado_sesion AS text) = 'finalizado'
              )
            ORDER BY cs.fecha_calificacion DESC
            LIMIT 3
            """, nativeQuery = true)
    List<InstructorPerfilCalificacionProjection> obtenerPerfilCalificaciones(
            @Param("idInstructor") Integer idInstructor);
}