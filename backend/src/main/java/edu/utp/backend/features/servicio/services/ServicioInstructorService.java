package edu.utp.backend.features.servicio.services;

import java.util.List;

import edu.utp.backend.features.servicio.dtos.ServicioInstructorDto;

public interface ServicioInstructorService {
    List<ServicioInstructorDto> findAll();

    ServicioInstructorDto findById(Integer id);

    ServicioInstructorDto create(ServicioInstructorDto request);

    ServicioInstructorDto update(Integer id, ServicioInstructorDto request);

    void delete(Integer id);
}