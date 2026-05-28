package edu.utp.backend.features.sede.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.utp.backend.features.sede.dtos.SedeDto;
import edu.utp.backend.features.sede.entities.Sede;
import edu.utp.backend.features.sede.repositories.SedeRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SedeServiceImpl implements SedeService {

    private final SedeRepository sedeRepository;

    @Override
    public List<SedeDto> findAll() {
        return sedeRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    public SedeDto findById(Integer id) {
        return sedeRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Sede no encontrada: " + id));
    }

    @Override
    @Transactional
    public SedeDto create(SedeDto request) {
        Sede sede = new Sede();
        apply(sede, request);
        return toDto(sedeRepository.save(sede));
    }

    @Override
    @Transactional
    public SedeDto update(Integer id, SedeDto request) {
        Sede sede = sedeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Sede no encontrada: " + id));
        apply(sede, request);
        return toDto(sedeRepository.save(sede));
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        sedeRepository.deleteById(id);
    }

    private void apply(Sede sede, SedeDto request) {
        sede.setIdInstructor(request.idInstructor());
        sede.setUrlImagenSede1(request.urlImagenSede1());
        sede.setUrlImagenSede2(request.urlImagenSede2());
        sede.setUrlImagenSede3(request.urlImagenSede3());
        sede.setDescripcionSede(request.descripcionSede());
        sede.setDireccionSede(request.direccionSede());
        sede.setDistritoSede(request.distritoSede());
        sede.setEstadoActivacion(request.estadoActivacion());
    }

    private SedeDto toDto(Sede sede) {
        return new SedeDto(
                sede.getIdSede(),
                sede.getIdInstructor(),
                sede.getUrlImagenSede1(),
                sede.getUrlImagenSede2(),
                sede.getUrlImagenSede3(),
                sede.getDescripcionSede(),
                sede.getDireccionSede(),
                sede.getDistritoSede(),
                sede.getEstadoActivacion());
    }
}