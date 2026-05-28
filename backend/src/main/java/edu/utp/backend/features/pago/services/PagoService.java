package edu.utp.backend.features.pago.services;

import java.util.List;

import edu.utp.backend.features.pago.dtos.PagoDto;

public interface PagoService {
    List<PagoDto> findAll();

    PagoDto findById(Integer id);

    PagoDto create(PagoDto request);

    PagoDto update(Integer id, PagoDto request);

    void delete(Integer id);
}