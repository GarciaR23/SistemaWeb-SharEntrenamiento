package edu.utp.backend.features.tutor.progreso_paciente.services;

import java.math.BigDecimal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import edu.utp.backend.features.tutor.progreso_paciente.dtos.ProgresoKpiDto;
import edu.utp.backend.features.tutor.progreso_paciente.repositories.ProgresoPacienteRepository;
import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ProgresoPacienteService {

    private final ProgresoPacienteRepository repository;

    public ProgresoKpiDto obtenerProgresoKpi(Integer idPaciente) {
        Object[] row = repository.findProgresoKpi(idPaciente);
        Object[] tendencia = repository.findTendenciaKpi(idPaciente);

        BigDecimal promCoord = BigDecimal.ZERO, promEqui = BigDecimal.ZERO, promRes = BigDecimal.ZERO;
        Long total = 0L;
        BigDecimal tendCoord = BigDecimal.ZERO, tendEqui = BigDecimal.ZERO, tendRes = BigDecimal.ZERO;

        if (row != null) {
            promCoord = (BigDecimal) row[0];
            promEqui = (BigDecimal) row[1];
            promRes = (BigDecimal) row[2];
            total = ((Number) row[3]).longValue();
        }

        if (tendencia != null) {
            tendRes = (BigDecimal) tendencia[0]; 
            tendEqui = (BigDecimal) tendencia[1];
            tendCoord = (BigDecimal) tendencia[2]; 
        }

        return new ProgresoKpiDto(promCoord, promEqui, promRes, total, tendCoord, tendEqui, tendRes);
    }
}