package edu.utp.backend.features.reserva.services;

import java.util.List;

import edu.utp.backend.features.reserva.dtos.ReservaDto;

public interface ReservaService {
    List<ReservaDto> findAll();

    ReservaDto findById(Integer id);

    ReservaDto create(ReservaDto request);

    ReservaDto update(Integer id, ReservaDto request);

    void delete(Integer id);
}