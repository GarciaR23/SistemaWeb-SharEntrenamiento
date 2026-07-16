package edu.utp.backend.features.admin.reporte.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.utp.backend.features.admin.reporte.dtos.ContadorObservacionesDto;
import edu.utp.backend.features.admin.reporte.dtos.ObservacionDto;
import edu.utp.backend.features.admin.reporte.repositories.AdminObservacionRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminObservacionService {

    private final AdminObservacionRepository adminObservacionRepository;

    @Transactional(readOnly = true)
    public ContadorObservacionesDto obtenerContadores() {
        Object[] result = adminObservacionRepository.obtenerContadoresObservaciones();
        return new ContadorObservacionesDto(
                result[0] != null ? ((Number) result[0]).longValue() : 0L,
                result[1] != null ? ((Number) result[1]).longValue() : 0L,
                result[2] != null ? ((Number) result[2]).longValue() : 0L);
    }

    @Transactional(readOnly = true)
    public List<ObservacionDto> obtenerObservaciones() {
        List<Object[]> results = adminObservacionRepository.obtenerObservaciones();
        return results.stream()
                .map(row -> new ObservacionDto(
                        ((Number) row[0]).intValue(),
                        row[1] != null ? ((Number) row[1]).intValue() : null,
                        (String) row[2],
                        (String) row[3],
                        (String) row[4],
                        (String) row[5],
                        (String) row[6],
                        (String) row[7],
                        (String) row[8],
                        (String) row[9],
                        (String) row[10],
                        (String) row[11],
                        (String) row[12]))
                .toList();
    }

    @Transactional
    public void actualizarAccion(Integer idIncidencia, String accion) {
        if (!List.of("rechazado", "mediacion", "suspender").contains(accion)) {
            throw new IllegalArgumentException("Acción no válida: " + accion);
        }
        adminObservacionRepository.actualizarAccion(idIncidencia, accion);
    }
}