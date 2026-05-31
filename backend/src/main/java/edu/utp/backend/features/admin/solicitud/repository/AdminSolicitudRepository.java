package edu.utp.backend.features.admin.solicitud.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import edu.utp.backend.features.admin.solicitud.entities.VistaAdminSolicitud;

import java.util.List;

@Repository
public interface AdminSolicitudRepository extends JpaRepository<VistaAdminSolicitud, Integer> {
    @Query(value = "SELECT * FROM vista_admin_cards_solicitudes WHERE estado_usuario = 'pendiente_validacion'", nativeQuery = true)
    List<VistaAdminSolicitud> obtenerSoloPendientesValidacion();
}