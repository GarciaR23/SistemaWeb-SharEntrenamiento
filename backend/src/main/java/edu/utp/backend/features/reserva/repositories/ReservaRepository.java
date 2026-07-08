package edu.utp.backend.features.reserva.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import edu.utp.backend.features.reserva.entities.Reserva;
import edu.utp.backend.features.reserva.projections.ReservaTutorSesionProjection;

public interface ReservaRepository extends JpaRepository<Reserva, Integer> {

  List<Reserva> findByIdPacienteOrderByFechaCreacionDesc(Integer idPaciente);

  List<Reserva> findByIdInstructorOrderByFechaCreacionDesc(Integer idInstructor);

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
          dr.hora_inicio_estimada AS horaInicioEstimada,
          dr.hora_fin_estimada AS horaFinEstimada,
          EXTRACT(EPOCH FROM dr.duracion_entrenamiento) / 60 AS duracionMinutos,
          r.monto_total_acumulado AS montoTotalAcumulado,
          r.estado_reserva AS estadoReserva,
          COALESCE(se.estado_sesion::text, 'programada') AS estadoSesion,
          r.fecha_creacion AS fechaCreacion
      FROM reserva r
      INNER JOIN paciente p ON p.id_paciente = r.id_paciente
      INNER JOIN instructor i ON i.id_instructor = r.id_instructor
      INNER JOIN sede s ON s.id_sede = r.id_sede
      INNER JOIN detalle_reserva dr ON dr.id_reserva = r.id_reserva
      LEFT JOIN sesion se ON se.id_reserva = r.id_reserva
      WHERE p.id_tutor = :idTutor
      ORDER BY dr.hora_inicio_estimada DESC
      """, nativeQuery = true)
  List<ReservaTutorSesionProjection> findSesionesByTutor(@Param("idTutor") Integer idTutor);
}