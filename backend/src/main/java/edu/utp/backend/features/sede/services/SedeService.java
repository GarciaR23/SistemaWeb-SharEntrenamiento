package edu.utp.backend.features.sede.services;

import java.util.List;

import edu.utp.backend.features.sede.dtos.SedeRequest;
import edu.utp.backend.features.sede.dtos.SedeResponse;

public interface SedeService {
    List<SedeResponse> findAll();

    SedeResponse findById(Integer id);

    SedeResponse create(SedeRequest request);

    SedeResponse update(Integer id, SedeRequest request);

    void delete(Integer id);

    List<SedeResponse> listarPorInstructor(Integer idInstructor);

    List<SedeResponse> buscarPorDistrito(Integer idInstructor, String distrito);

    List<SedeResponse> buscarPorDireccion(Integer idInstructor, String direccion);

    SedeResponse actualizarEstado(Integer idSede, Boolean estadoActivacion);
}