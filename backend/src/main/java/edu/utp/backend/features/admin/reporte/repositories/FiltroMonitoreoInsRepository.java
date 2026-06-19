package edu.utp.backend.features.admin.reporte.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import edu.utp.backend.features.admin.reporte.entities.VistaMonitoreoIns;

public interface FiltroMonitoreoInsRepository extends JpaRepository<VistaMonitoreoIns, Integer> {

    @Query("SELECT m FROM VistaMonitoreoIns m WHERE LOWER(m.nombreCompleto) LIKE LOWER(CONCAT('%', :nombre, '%'))")
    List<VistaMonitoreoIns> buscarPorNombre(@Param("nombre") String nombre);
}
