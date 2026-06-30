package edu.utp.backend.features.reserva.services;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.utp.backend.features.reserva.dtos.ReservaDto;
import edu.utp.backend.features.reserva.dtos.ReservaRequestDto;
import edu.utp.backend.features.reserva.entities.Reserva;
import edu.utp.backend.features.reserva.repositories.ReservaRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReservaServiceImpl implements ReservaService {

    private final ReservaRepository reservaRepository;

    @Override
    public List<ReservaDto> findAll() {
        return reservaRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public List<ReservaDto> findByPaciente(Integer idPaciente) {
        return reservaRepository.findByIdPacienteOrderBySeleccionHorarioDesc(idPaciente)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public List<ReservaDto> findByInstructor(Integer idInstructor) {
        return reservaRepository.findByIdInstructorOrderBySeleccionHorarioDesc(idInstructor)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public ReservaDto findById(Integer id) {
        return reservaRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Reserva no encontrada: " + id));
    }

    @Override
    @Transactional
    public ReservaDto create(ReservaRequestDto request) {
        validarReserva(request);

        LocalDateTime fechaInicio = request.seleccionHorario();
        LocalDateTime fechaFin = fechaInicio.plusMinutes(request.duracionMinutos());

        boolean existeCruce = reservaRepository.existeCruceInstructor(
                request.idInstructor(),
                fechaInicio,
                fechaFin
        );

        if (existeCruce) {
            throw new IllegalArgumentException("El instructor ya tiene una reserva en ese horario.");
        }

        Reserva reserva = new Reserva();
        reserva.setIdPaciente(request.idPaciente());
        reserva.setIdInstructor(request.idInstructor());
        reserva.setIdSede(request.idSede());
        reserva.setSeleccionHorario(request.seleccionHorario());
        reserva.setDuracionEntrenamiento(Duration.ofMinutes(request.duracionMinutos()));
        reserva.setMontoTotal(request.montoTotal());
        reserva.setEstadoReserva("pendiente");

        Reserva reservaGuardada = reservaRepository.save(reserva);

        return toDto(reservaGuardada);
    }

    @Override
    @Transactional
    public void cancelar(Integer id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reserva no encontrada: " + id));

        reserva.setEstadoReserva("cancelada");
        reservaRepository.save(reserva);
    }

    private void validarReserva(ReservaRequestDto request) {
        if (request.idPaciente() == null) {
            throw new IllegalArgumentException("El paciente es obligatorio.");
        }

        if (request.idInstructor() == null) {
            throw new IllegalArgumentException("El instructor es obligatorio.");
        }

        if (request.idSede() == null) {
            throw new IllegalArgumentException("La sede es obligatoria.");
        }

        if (request.seleccionHorario() == null) {
            throw new IllegalArgumentException("Debe seleccionar una fecha y hora.");
        }

        if (request.seleccionHorario().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("No se puede reservar en una fecha pasada.");
        }

        if (request.duracionMinutos() == null || request.duracionMinutos() < 30) {
            throw new IllegalArgumentException("La duración mínima debe ser de 30 minutos.");
        }

        if (request.montoTotal() == null) {
            throw new IllegalArgumentException("El monto total es obligatorio.");
        }
    }

    private ReservaDto toDto(Reserva reserva) {
        Integer duracionMinutos = reserva.getDuracionEntrenamiento() != null
                ? (int) reserva.getDuracionEntrenamiento().toMinutes()
                : null;

        return new ReservaDto(
                reserva.getIdReserva(),
                reserva.getIdPaciente(),
                reserva.getIdInstructor(),
                reserva.getIdSede(),
                reserva.getSeleccionHorario(),
                duracionMinutos,
                reserva.getMontoTotal(),
                reserva.getEstadoReserva(),
                reserva.getFechaCreacion()
        );
    }
}