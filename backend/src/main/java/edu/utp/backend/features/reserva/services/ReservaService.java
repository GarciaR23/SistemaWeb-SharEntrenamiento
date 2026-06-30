package edu.utp.backend.features.reserva.services;

import java.util.List;

import edu.utp.backend.features.reserva.dtos.ReservaDto;
import edu.utp.backend.features.reserva.dtos.ReservaRequestDto;

public interface ReservaService {

    List<ReservaDto> findAll();

    List<ReservaDto> findByPaciente(Integer idPaciente);

    List<ReservaDto> findByInstructor(Integer idInstructor);

    ReservaDto findById(Integer id);

    ReservaDto create(ReservaRequestDto request);

    void cancelar(Integer id);
}