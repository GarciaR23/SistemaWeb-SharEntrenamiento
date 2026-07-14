package edu.utp.backend.features.rendimiento.rutina.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import edu.utp.backend.features.rendimiento.rutina.entities.DetalleRutina;

@Repository
public interface DetalleRutinaRepository extends JpaRepository<DetalleRutina, Integer> {

    List<DetalleRutina> findByHojaRuta_IdRuta(Integer idRuta);

    @Query(value = """
            SELECT dr.duracion_entrenamiento::text
            FROM detalle_reserva dr
            INNER JOIN hoja_ruta hr ON dr.id_reserva = hr.id_reserva
            WHERE hr.id_ruta = :idRuta
            """, nativeQuery = true)
    String obtenerDuracionPermitida(@Param("idRuta") Integer idRuta);
}