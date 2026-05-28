package edu.utp.backend.features.sede.services;

import java.util.List;

import edu.utp.backend.features.sede.dtos.SedeDto;

public interface SedeService {
    List<SedeDto> findAll();

    SedeDto findById(Integer id);

    SedeDto create(SedeDto request);

    SedeDto update(Integer id, SedeDto request);

    void delete(Integer id);
}