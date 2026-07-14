package edu.utp.backend.features.instructor.analitica.services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.utp.backend.features.instructor.analitica.dtos.AgendaHoyDto;
import edu.utp.backend.features.instructor.analitica.dtos.AlertaPendienteDto;
import edu.utp.backend.features.instructor.analitica.dtos.CalificacionPromedioDto;
import edu.utp.backend.features.instructor.analitica.dtos.GraficoSesionesDto;
import edu.utp.backend.features.instructor.analitica.dtos.PacientesActivosDto;
import edu.utp.backend.features.instructor.analitica.dtos.SesionesFinalizadasDto;
import edu.utp.backend.features.instructor.analitica.repositories.AnaliticaRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AnaliticaService {

    private final AnaliticaRepository analiticaRepository;

    @Transactional(readOnly = true)
    public CalificacionPromedioDto obtenerPromedioCalificacion() {
        Object[] result = analiticaRepository.obtenerPromedioCalificacion();

        BigDecimal promedioEstrellas = BigDecimal.ZERO;
        Long totalCalificaciones = 0L;

        if (result[0] != null) {
            promedioEstrellas = new BigDecimal(result[0].toString()).setScale(2, RoundingMode.HALF_UP);
        }
        if (result[1] != null) {
            totalCalificaciones = ((Number) result[1]).longValue();
        }

        return new CalificacionPromedioDto(promedioEstrellas, totalCalificaciones);
    }

    @Transactional(readOnly = true)
    public PacientesActivosDto obtenerPacientesActivos() {
        Object[] result = analiticaRepository.obtenerPacientesActivos();

        Long totalActivosActual = 0L;
        BigDecimal porcentajeVariacion = BigDecimal.ZERO;

        if (result[0] != null) {
            totalActivosActual = ((Number) result[0]).longValue();
        }
        if (result[1] != null) {
            porcentajeVariacion = new BigDecimal(result[1].toString()).setScale(2, RoundingMode.HALF_UP);
        }

        return new PacientesActivosDto(totalActivosActual, porcentajeVariacion);
    }

    @Transactional(readOnly = true)
    public SesionesFinalizadasDto obtenerSesionesFinalizadas() {
        Object[] result = analiticaRepository.obtenerSesionesFinalizadas();

        Long totalSesionesActual = 0L;
        BigDecimal porcentajeVariacion = BigDecimal.ZERO;

        if (result[0] != null) {
            totalSesionesActual = ((Number) result[0]).longValue();
        }
        if (result[1] != null) {
            porcentajeVariacion = new BigDecimal(result[1].toString()).setScale(2, RoundingMode.HALF_UP);
        }

        return new SesionesFinalizadasDto(totalSesionesActual, porcentajeVariacion);
    }

    @Transactional(readOnly = true)
    public List<GraficoSesionesDto> obtenerGraficoSesiones(Long idInstructor) {
        List<Object[]> results = analiticaRepository.obtenerGraficoSesiones(idInstructor);
        return results.stream()
                .map(row -> new GraficoSesionesDto(
                        ((Number) row[0]).intValue(),
                        (String) row[1],
                        ((Number) row[2]).longValue()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AgendaHoyDto> obtenerAgendaHoy(Integer idInstructor) {
        List<Object[]> results = analiticaRepository.obtenerAgendaHoy(idInstructor);
        return results.stream()
                .map(row -> new AgendaHoyDto(
                        ((Number) row[0]).intValue(),
                        row[1] != null ? ((java.sql.Time) row[1]).toLocalTime() : null,
                        row[2] != null ? ((java.sql.Time) row[2]).toLocalTime() : null,
                        (String) row[3],
                        (String) row[4],
                        (String) row[5],
                        (String) row[6]))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AlertaPendienteDto> obtenerAlertasPendientes(Integer idInstructor) {
        List<Object[]> results = analiticaRepository.obtenerAlertasPendientes(idInstructor);
        return results.stream()
                .map(row -> new AlertaPendienteDto(
                        ((Number) row[0]).intValue(),
                        (String) row[1],
                        (String) row[2],
                        ((Number) row[3]).intValue()))
                .toList();
    }
}