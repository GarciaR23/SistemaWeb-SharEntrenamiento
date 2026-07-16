package edu.utp.backend.features.admin.reporte.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import edu.utp.backend.features.admin.reporte.entities.VistaMonitoreoIns;

@Repository
public interface MonitoreoInstRepository extends JpaRepository<VistaMonitoreoIns, Integer> {

    @Query(value = "SELECT COUNT(*) FROM vista_admin_tabla_instructores", nativeQuery = true)
    Long contarTotalInstructor();

    @Query(value = "select count(*) from vista_admin_tabla_instructores WHERE estado_cuenta = 'activo'", nativeQuery = true)
    Long contarActivoInstructor();

    @Query(value = "select count(*) from vista_admin_tabla_instructores WHERE estado_cuenta = 'pendiente_validacion'", nativeQuery = true)
    Long contarPendienteInstructor();
}
