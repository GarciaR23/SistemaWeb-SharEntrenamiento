package edu.utp.backend.features.tutor.explorar_instructor.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.utp.backend.features.tutor.explorar_instructor.entities.VistaExplorarIns;
import edu.utp.backend.features.tutor.explorar_instructor.repositories.VistaExplorarInsRepository;
import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class VistaExplorarInsServices {
    private final VistaExplorarInsRepository repository;

    public List<VistaExplorarIns> findAll() {
        return repository.findAll();
    }
}
