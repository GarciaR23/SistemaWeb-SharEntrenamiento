package edu.utp.backend.features.admin.solicitud.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.utp.backend.features.admin.solicitud.entities.VistaAdminSolicitud;
import edu.utp.backend.features.admin.solicitud.repository.AdminSolicitudRepository;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class AdminSolicitudService {

    @Autowired
    private AdminSolicitudRepository solicitudRepository;

    public List<VistaAdminSolicitud> obtenerSolicitudesPendientes() {
        return solicitudRepository.obtenerSoloPendientesValidacion();
    }

    public Map<String, Long> obtenerConteoSolicitudes() {
        Map<String, Long> conteos = new LinkedHashMap<>();
        conteos.put("totalPendientes", solicitudRepository.contarPendientes());
        conteos.put("pendientesHoy", solicitudRepository.contarPendientesHoy());
        conteos.put("pendientesPorVencer", solicitudRepository.contarPendientesPorVencer());
        return conteos;
    }
}