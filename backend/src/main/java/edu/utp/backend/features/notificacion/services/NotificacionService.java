package edu.utp.backend.features.notificacion.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.utp.backend.features.notificacion.dtos.NotificacionDto;
import edu.utp.backend.features.notificacion.dtos.NotificacionesResponse;
import edu.utp.backend.features.notificacion.repositories.NotificacionRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificacionService {

    private final NotificacionRepository notificacionRepository;

    @Transactional(readOnly = true)
    public NotificacionesResponse obtenerNotificacionesAdmin() {
        List<Object[]> results = notificacionRepository.obtenerNotificacionesAdmin();
        List<NotificacionDto> notificaciones = results.stream()
                .map(row -> new NotificacionDto(
                        ((Number) row[0]).intValue(),
                        (String) row[1],
                        (String) row[2],
                        (String) row[3],
                        row[4] != null
                                ? ((java.time.Instant) row[4]).atZone(java.time.ZoneId.systemDefault())
                                        .toLocalDateTime()
                                : null))
                .toList();
        Long total = notificacionRepository.contarTotalAdmin();
        return new NotificacionesResponse(notificaciones, total);
    }

    @Transactional(readOnly = true)
    public NotificacionesResponse obtenerNotificacionesInstructor(Integer idInstructor) {
        List<Object[]> results = notificacionRepository.obtenerNotificacionesInstructor(idInstructor);
        List<NotificacionDto> notificaciones = results.stream()
                .map(row -> new NotificacionDto(
                        ((Number) row[4]).intValue(),
                        (String) row[2],
                        (String) row[3],
                        (String) row[1],
                        row[5] != null
                                ? ((java.time.Instant) row[5]).atZone(java.time.ZoneId.systemDefault())
                                        .toLocalDateTime()
                                : null))
                .toList();
        Long total = notificacionRepository.contarTotalInstructor(idInstructor);
        return new NotificacionesResponse(notificaciones, total);
    }

    @Transactional(readOnly = true)
    public NotificacionesResponse obtenerNotificacionesPaciente(Integer idPaciente) {
        List<Object[]> results = notificacionRepository.obtenerNotificacionesPaciente(idPaciente);
        List<NotificacionDto> notificaciones = results.stream()
                .map(row -> new NotificacionDto(
                        ((Number) row[4]).intValue(),
                        (String) row[2],
                        (String) row[3],
                        (String) row[1],
                        row[5] != null
                                ? ((java.time.Instant) row[5]).atZone(java.time.ZoneId.systemDefault())
                                        .toLocalDateTime()
                                : null))
                .toList();
        Long total = notificacionRepository.contarTotalPaciente(idPaciente);
        return new NotificacionesResponse(notificaciones, total);
    }
}