package edu.utp.backend.features.admin.reporte.services;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.utp.backend.features.admin.reporte.entities.VistaMonitoreoIns;
import edu.utp.backend.features.admin.reporte.repositories.MonitoreoInstRepository;
import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MonitoreoInstService {

    @Autowired
    private MonitoreoInstRepository monitoreoInstRepository;

    public List<VistaMonitoreoIns> findAll() {
        return monitoreoInstRepository.findAll();
    }

    public Map<String, Long> obtenerConteoMonitoreo() {
        Map<String, Long> conteoMonitoreo = new LinkedHashMap<>();
        conteoMonitoreo.put("totalInstructor", monitoreoInstRepository.contarTotalInstructor());
        conteoMonitoreo.put("activoInstructor", monitoreoInstRepository.contarActivoInstructor());
        conteoMonitoreo.put("pendienteInstructor", monitoreoInstRepository.contarPendienteInstructor());
        return conteoMonitoreo;
    }
}
