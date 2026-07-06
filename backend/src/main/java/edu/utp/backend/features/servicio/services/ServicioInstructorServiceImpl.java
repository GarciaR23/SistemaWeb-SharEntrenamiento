package edu.utp.backend.features.servicio.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.utp.backend.features.servicio.dtos.ServicioInstructorDto;
import edu.utp.backend.features.servicio.entities.ServicioInstructor;
import edu.utp.backend.features.servicio.repositories.ServicioInstructorRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServicioInstructorServiceImpl implements ServicioInstructorService {

    private final ServicioInstructorRepository servicioInstructorRepository;

    @Override
    public List<ServicioInstructorDto> findAll() {
        return servicioInstructorRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    public ServicioInstructorDto findById(Integer id) {
        return servicioInstructorRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Servicio no encontrado: " + id));
    }

    @Override
    @Transactional
    public ServicioInstructorDto create(ServicioInstructorDto request) {
        ServicioInstructor servicio = new ServicioInstructor();
        apply(servicio, request);
        return toDto(servicioInstructorRepository.save(servicio));
    }

    @Override
    @Transactional
    public ServicioInstructorDto update(Integer id, ServicioInstructorDto request) {
        ServicioInstructor servicio = servicioInstructorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Servicio no encontrado: " + id));
        apply(servicio, request);
        return toDto(servicioInstructorRepository.save(servicio));
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        servicioInstructorRepository.deleteById(id);
    }

    private void apply(ServicioInstructor servicio, ServicioInstructorDto request) {
        servicio.setIdInstructor(request.idInstructor());
        servicio.setTarifaHora(request.tarifaHora());
    }

    private ServicioInstructorDto toDto(ServicioInstructor servicio) {
        return new ServicioInstructorDto(
                servicio.getIdServicio(),
                servicio.getIdInstructor(),
                servicio.getTarifaHora());
    }
}