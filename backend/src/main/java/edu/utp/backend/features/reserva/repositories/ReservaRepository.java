package edu.utp.backend.features.reserva.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import edu.utp.backend.features.reserva.entities.Reserva;
import edu.utp.backend.features.reserva.projections.ReservaTutorSesionProjection;

public interface ReservaRepository extends JpaRepository<Reserva, Integer> {

        List<Reserva> findByIdPacienteOrderBySeleccionHorarioDesc(Integer idPaciente);

        List<Reserva> findByIdInstructorOrderBySeleccionHorarioDesc(Integer idInstructor);

        @Query(value = """
                        SELECT COUNT(*) > 0
                        FROM reserva
                        WHERE id_instructor = :idInstructor
                          AND estado_reserva IN ('pendiente'::estado_reserva_enum, 'aprobada'::estado_reserva_enum)
                          AND seleccion_horario < :fechaFin
                          AND (seleccion_horario + duracion_entrenamiento) > :fechaInicio
                        """, nativeQuery = true)
        boolean existeCruceInstructor(
                        @Param("idInstructor") Integer idInstructor,
                        @Param("fechaInicio") LocalDateTime fechaInicio,
                        @Param("fechaFin") LocalDateTime fechaFin);

        @Query(value = """
                        SELECT
                            r.id_reserva AS idReserva,
                            p.id_paciente AS idPaciente,
                            p.nombre_completo AS pacienteNombre,
                            p.url_imagen_paciente AS pacienteImagen,
                            i.id_instructor AS idInstructor,
                            i.nombre_completo AS instructorNombre,
                            i.url_imagen_perfil AS instructorImagen,
                            i.especialidad AS especialidad,
                            s.id_sede AS idSede,
                            s.nombre_sede AS nombreSede,
                            s.direccion_sede AS direccionSede,
                            r.seleccion_horario AS seleccionHorario,
                            EXTRACT(EPOCH FROM r.duracion_entrenamiento) / 60 AS duracionMinutos,
                            r.monto_total AS montoTotal,
                            r.estado_reserva AS estadoReserva,
                            COALESCE(se.estado_sesion::text, 'programada') AS estadoSesion,
                            r.fecha_creacion AS fechaCreacion
                        FROM reserva r
                        INNER JOIN paciente p ON p.id_paciente = r.id_paciente
                        INNER JOIN instructor i ON i.id_instructor = r.id_instructor
                        INNER JOIN sede s ON s.id_sede = r.id_sede
                        LEFT JOIN sesion se ON se.id_reserva = r.id_reserva
                        WHERE p.id_tutor = :idTutor
                        ORDER BY r.seleccion_horario DESC
                        """, nativeQuery = true)
        List<ReservaTutorSesionProjection> findSesionesByTutor(@Param("idTutor") Integer idTutor);
}