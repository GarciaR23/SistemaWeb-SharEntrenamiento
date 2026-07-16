package edu.utp.backend.features.reserva.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import edu.utp.backend.features.reserva.entities.DetalleReserva;

public interface DetalleReservaRepository extends JpaRepository<DetalleReserva, Integer> {

        List<DetalleReserva> findByIdReserva(Integer idReserva);

        @Query(value = """
                        SELECT COUNT(*) > 0
                        FROM detalle_reserva dr
                        JOIN reserva r ON dr.id_reserva = r.id_reserva
                        WHERE r.id_instructor = :idInstructor
                          AND dr.estado_detalle IN ('pendiente', 'aprobada')
                          AND dr.hora_inicio_estimada < :horaFin
                          AND dr.hora_fin_estimada > :horaInicio
                        """, nativeQuery = true)
        boolean existeCruceInstructor(
                        @Param("idInstructor") Integer idInstructor,
                        @Param("horaInicio") LocalDateTime horaInicio,
                        @Param("horaFin") LocalDateTime horaFin);
}