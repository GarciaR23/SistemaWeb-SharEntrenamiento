package edu.utp.backend.features.reserva.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import edu.utp.backend.features.reserva.entities.Reserva;

public interface ReservaRepository extends JpaRepository<Reserva, Integer> {

    List<Reserva> findByIdPacienteOrderBySeleccionHorarioDesc(Integer idPaciente);

    List<Reserva> findByIdInstructorOrderBySeleccionHorarioDesc(Integer idInstructor);

    @Query(value = """
            SELECT COUNT(*) > 0
            FROM reserva
            WHERE id_instructor = :idInstructor
              AND estado_reserva <> 'cancelada'
              AND seleccion_horario < :fechaFin
              AND (seleccion_horario + duracion_entrenamiento) > :fechaInicio
            """, nativeQuery = true)
    boolean existeCruceInstructor(
            @Param("idInstructor") Integer idInstructor,
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin
    );
}