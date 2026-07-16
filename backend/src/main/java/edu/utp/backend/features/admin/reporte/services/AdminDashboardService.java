package edu.utp.backend.features.admin.reporte.services;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.utp.backend.features.admin.reporte.dtos.CrecimientoInstructorDto;
import edu.utp.backend.features.admin.reporte.dtos.DashboardEstadoSolicitudDto;
import edu.utp.backend.features.admin.reporte.dtos.DashboardInstructoresDto;
import edu.utp.backend.features.admin.reporte.dtos.EstadoSolicitudDto;
import edu.utp.backend.features.admin.reporte.dtos.PacienteControlDto;
import edu.utp.backend.features.admin.reporte.repositories.AdminDashboardRepository;
import edu.utp.backend.features.admin.reporte.repositories.MonitoreoPacRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final MonitoreoPacRepository monitoreoPacRepository;
    private final AdminDashboardRepository adminDashboardRepository;

    @Transactional(readOnly = true)
    public PacienteControlDto obtenerControlPacientes() {
        Long totalPacientes = monitoreoPacRepository.contarTotalPaciente();
        Long activos = monitoreoPacRepository.contarActivoPaciente();
        Long inactivos60Dias = monitoreoPacRepository.contarInactivos60Dias();
        Object[] porcentaje = monitoreoPacRepository.obtenerPorcentajePaciente();

        Double porcentajeVariacion = 0.0;
        if (porcentaje != null && porcentaje.length > 0 && porcentaje[0] != null) {
            porcentajeVariacion = ((Number) porcentaje[0]).doubleValue();
        }

        return new PacienteControlDto(
                totalPacientes != null ? totalPacientes : 0L,
                activos != null ? activos : 0L,
                inactivos60Dias != null ? inactivos60Dias : 0L,
                activos != null ? activos : 0L,
                porcentajeVariacion);
    }

    @Transactional(readOnly = true)
    public DashboardInstructoresDto obtenerDashboardInstructores(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        Timestamp inicio = fechaInicio != null ? Timestamp.valueOf(fechaInicio)
                : Timestamp.valueOf(LocalDateTime.now().minusMonths(6));
        Timestamp fin = fechaFin != null ? Timestamp.valueOf(fechaFin)
                : Timestamp.valueOf(LocalDateTime.now());

        List<Object[]> crecimiento = adminDashboardRepository.obtenerCrecimientoInstructores(inicio, fin);
        List<CrecimientoInstructorDto> crecimientoList = crecimiento.stream()
                .map(row -> new CrecimientoInstructorDto((String) row[0], ((Number) row[1]).longValue()))
                .toList();

        Double porcentajeMensual = adminDashboardRepository.obtenerPorcentajeMensual();
        if (porcentajeMensual == null)
            porcentajeMensual = 0.0;

        return new DashboardInstructoresDto(crecimientoList, porcentajeMensual);
    }

    @Transactional(readOnly = true)
    public DashboardEstadoSolicitudDto obtenerEstadoSolicitudes() {
        List<Object[]> results = adminDashboardRepository.obtenerEstadoSolicitudes();
        List<EstadoSolicitudDto> estados = results.stream()
                .map(row -> new EstadoSolicitudDto(
                        (String) row[0],
                        row[1] != null ? ((Number) row[1]).doubleValue() : 0.0))
                .toList();

        Long total = adminDashboardRepository.contarTotalInstructores();

        return new DashboardEstadoSolicitudDto(estados, total);
    }
}