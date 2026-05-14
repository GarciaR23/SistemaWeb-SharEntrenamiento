package edu.utp.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import edu.utp.backend.entity.ProtocoloEmergencia;
import edu.utp.backend.repository.ProtocoloEmergenciaRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProtocoloEmergenciaService {

    private final ProtocoloEmergenciaRepository repository;

    public List<ProtocoloEmergencia> findAll() {
        return repository.findAll();
    }

    public ProtocoloEmergencia create(ProtocoloEmergencia protocolo) {
        return repository.save(protocolo);
    }
}
