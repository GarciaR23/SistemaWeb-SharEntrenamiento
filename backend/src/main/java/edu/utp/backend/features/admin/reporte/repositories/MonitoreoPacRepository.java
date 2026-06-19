package edu.utp.backend.features.admin.reporte.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.utp.backend.features.admin.reporte.entities.VistaMonitoreoPaciente;

public interface MonitoreoPacRepository extends JpaRepository<VistaMonitoreoPaciente, Integer> {
    @Query(value = "SELECT COUNT(*) FROM vista_admin_tabla_pacientes", nativeQuery = true)
    Long contarTotalPaciente();

    @Query(value = "select count(*) from vista_admin_tabla_pacientes WHERE estado_cuenta = 'activo'", nativeQuery = true)
    Long contarActivoPaciente();

    @Query(value = "SELECT COUNT(*) FROM vista_admin_tabla_pacientes WHERE estado_cuenta = 'activo' AND ultimo_login < NOW() - INTERVAL '60 days'", nativeQuery = true)
    Long contarInactivos60Dias();
}
