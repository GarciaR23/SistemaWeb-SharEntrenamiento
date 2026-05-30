package edu.utp.backend.features.auth.usuario.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.utp.backend.features.auth.usuario.entities.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
}