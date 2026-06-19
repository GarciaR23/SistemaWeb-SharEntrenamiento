package edu.utp.backend.features.admin.reporte.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.utp.backend.features.admin.reporte.entities.VistaMonitoreoIns;
import edu.utp.backend.features.admin.reporte.repositories.FiltroMonitoreoInsRepository;
import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class FiltroMonitoreoInstService {
    @Autowired
    private FiltroMonitoreoInsRepository filtroRepository;

    public List<VistaMonitoreoIns> buscarPorNombre(String nombre) {
        return filtroRepository.buscarPorNombre(nombre);
    }

}
