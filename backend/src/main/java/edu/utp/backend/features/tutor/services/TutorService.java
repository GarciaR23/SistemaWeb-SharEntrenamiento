package edu.utp.backend.features.tutor.services;

import java.util.List;

import edu.utp.backend.features.tutor.dtos.TutorDto;

public interface TutorService {
    List<TutorDto> findAll();

    TutorDto findById(Integer id);

    TutorDto create(TutorDto request);

    TutorDto update(Integer id, TutorDto request);

    void delete(Integer id);
}