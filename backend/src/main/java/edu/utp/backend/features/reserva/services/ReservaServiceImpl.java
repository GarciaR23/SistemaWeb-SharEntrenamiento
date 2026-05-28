package edu.utp.backend.features.reserva.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.utp.backend.features.reserva.dtos.ReservaDto;
import edu.utp.backend.features.reserva.entities.Reserva;
import edu.utp.backend.features.reserva.repositories.ReservaRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReservaServiceImpl implements ReservaService {

    private final ReservaRepository reservaRepository;

    @Override
    public List<ReservaDto> findAll() {
        return reservaRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    public ReservaDto findById(Integer id) {
        return reservaRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Reserva no encontrada: " + id));
    }

    @Override
    @Transactional
    public ReservaDto create(ReservaDto request) {
        Reserva reserva = new Reserva();
        apply(reserva, request);
        return toDto(reservaRepository.save(reserva));
    }

    @Override
    @Transactional
    public ReservaDto update(Integer id, ReservaDto request) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reserva no encontrada: " + id));
        apply(reserva, request);
        return toDto(reservaRepository.save(reserva));
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        reservaRepository.deleteById(id);
    }

    private void apply(Reserva reserva, ReservaDto request) {
        reserva.setIdPaciente(request.idPaciente());
        reserva.setIdInstructor(request.idInstructor());
        reserva.setIdSede(request.idSede());
        reserva.setSeleccionHorario(request.seleccionHorario());
        reserva.setDuracionEntrenamiento(request.duracionEntrenamiento());
        reserva.setMontoTotal(request.montoTotal());
        reserva.setEstadoReserva(request.estadoReserva());
    }

    private ReservaDto toDto(Reserva reserva) {
        return new ReservaDto(
                reserva.getIdReserva(),
                reserva.getIdPaciente(),
                reserva.getIdInstructor(),
                reserva.getIdSede(),
                reserva.getSeleccionHorario(),
                reserva.getDuracionEntrenamiento(),
                reserva.getMontoTotal(),
                reserva.getEstadoReserva(),
                reserva.getFechaCreacion());
    }
}