package edu.utp.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.utp.backend.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

}
