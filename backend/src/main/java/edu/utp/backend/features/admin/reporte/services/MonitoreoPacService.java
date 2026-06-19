package edu.utp.backend.features.admin.reporte.services;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import edu.utp.backend.features.admin.reporte.entities.VistaMonitoreoPaciente;
import edu.utp.backend.features.admin.reporte.repositories.MonitoreoPacRepository;
import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MonitoreoPacService {

    private final MonitoreoPacRepository monitoreoPacRepository;

    public List<VistaMonitoreoPaciente> findAll() {
        return monitoreoPacRepository.findAll();
    }

    public Map<String, Long> obtenerConteo() {
        Map<String, Long> conteoMonPac = new LinkedHashMap<>();
        conteoMonPac.put("totalPaciente", monitoreoPacRepository.contarTotalPaciente());
        conteoMonPac.put("activoPaciente", monitoreoPacRepository.contarActivoPaciente());
        conteoMonPac.put("inactivos60Dias", monitoreoPacRepository.contarInactivos60Dias());
        return conteoMonPac;
    }
}
