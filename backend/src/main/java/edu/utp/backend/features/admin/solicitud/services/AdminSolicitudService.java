package edu.utp.backend.features.admin.solicitud.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.utp.backend.features.admin.solicitud.entities.VistaAdminSolicitud;
import edu.utp.backend.features.admin.solicitud.repository.AdminSolicitudRepository;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class AdminSolicitudService {

    @Autowired
    private AdminSolicitudRepository solicitudRepository;

    public List<VistaAdminSolicitud> obtenerSolicitudesPendientes() {
        return solicitudRepository.obtenerSoloPendientesValidacion();
    }
}