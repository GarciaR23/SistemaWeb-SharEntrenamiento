package edu.utp.backend.features.usuario.services;

import java.util.List;

import edu.utp.backend.features.usuario.dtos.*;

public interface UsuarioService {
    List<UsuarioResponse> findAll();

    UsuarioResponse findById(Long id);

    UsuarioResponse create(UsuarioRequest request);

    UsuarioResponse update(Long id, UsuarioRequest request);

    void delete(Long id);
}