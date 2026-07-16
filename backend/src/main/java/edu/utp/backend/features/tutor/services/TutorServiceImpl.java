package edu.utp.backend.features.tutor.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.utp.backend.features.tutor.dtos.TutorDto;
import edu.utp.backend.features.tutor.entities.Tutor;
import edu.utp.backend.features.tutor.repositories.TutorRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TutorServiceImpl implements TutorService {

    private final TutorRepository tutorRepository;

    @Override
    public List<TutorDto> findAll() {
        return tutorRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    public TutorDto findById(Integer id) {
        return tutorRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Tutor no encontrado: " + id));
    }

    @Override
    @Transactional
    public TutorDto create(TutorDto request) {
        Tutor tutor = new Tutor();
        apply(tutor, request);
        return toDto(tutorRepository.save(tutor));
    }

    @Override
    @Transactional
    public TutorDto update(Integer id, TutorDto request) {
        Tutor tutor = tutorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tutor no encontrado: " + id));
        apply(tutor, request);
        return toDto(tutorRepository.save(tutor));
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        tutorRepository.deleteById(id);
    }

    private void apply(Tutor tutor, TutorDto request) {
        tutor.setIdUsuario(request.idUsuario());
        tutor.setNombreCompleto(request.nombreCompleto());
    }

    private TutorDto toDto(Tutor tutor) {
        return new TutorDto(tutor.getIdTutor(), tutor.getIdUsuario(), tutor.getNombreCompleto());
    }

    public TutorDto findByIdUsuario(Long idUsuario) {
        Tutor tutor = tutorRepository.findByIdUsuario(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Tutor no encontrado: " + idUsuario));
        return new TutorDto(tutor.getIdTutor(), tutor.getIdUsuario(), tutor.getNombreCompleto());
    }
}