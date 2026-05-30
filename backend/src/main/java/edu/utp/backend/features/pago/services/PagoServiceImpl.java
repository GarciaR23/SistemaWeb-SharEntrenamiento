package edu.utp.backend.features.pago.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.utp.backend.features.pago.dtos.PagoDto;
import edu.utp.backend.features.pago.entities.Pago;
import edu.utp.backend.features.pago.repositories.PagoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PagoServiceImpl implements PagoService {

    private final PagoRepository pagoRepository;

    @Override
    public List<PagoDto> findAll() {
        return pagoRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    public PagoDto findById(Integer id) {
        return pagoRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Pago no encontrado: " + id));
    }

    @Override
    @Transactional
    public PagoDto create(PagoDto request) {
        Pago pago = new Pago();
        apply(pago, request);
        return toDto(pagoRepository.save(pago));
    }

    @Override
    @Transactional
    public PagoDto update(Integer id, PagoDto request) {
        Pago pago = pagoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pago no encontrado: " + id));
        apply(pago, request);
        return toDto(pagoRepository.save(pago));
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        pagoRepository.deleteById(id);
    }

    private void apply(Pago pago, PagoDto request) {
        pago.setIdReserva(request.idReserva());
        pago.setIdPaciente(request.idPaciente());
        pago.setIdInstructor(request.idInstructor());
        pago.setMontoTotal(request.montoTotal());
        pago.setMetodoPago(request.metodoPago());
        pago.setEstadoPago(request.estadoPago());
    }

    private PagoDto toDto(Pago pago) {
        return new PagoDto(
                pago.getIdPago(),
                pago.getIdReserva(),
                pago.getIdPaciente(),
                pago.getIdInstructor(),
                pago.getMontoTotal(),
                pago.getMetodoPago(),
                pago.getFechaPago(),
                pago.getEstadoPago());
    }
}