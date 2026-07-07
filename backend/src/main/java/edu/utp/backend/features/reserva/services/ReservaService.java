package edu.utp.backend.features.reserva.services;

import java.util.List;

import edu.utp.backend.features.reserva.dtos.ReservaDto;
import edu.utp.backend.features.reserva.dtos.ReservaRequestDto;
import edu.utp.backend.features.reserva.dtos.ReservaTutorSesionDto;

public interface ReservaService {

    List<ReservaDto> findAll();

    List<ReservaDto> findByPaciente(Integer idPaciente);

    List<ReservaDto> findByInstructor(Integer idInstructor);

    List<ReservaTutorSesionDto> findSesionesByTutor(Integer idTutor);

    ReservaDto findById(Integer id);

    ReservaDto create(ReservaRequestDto request);

    void cancelar(Integer id);
}