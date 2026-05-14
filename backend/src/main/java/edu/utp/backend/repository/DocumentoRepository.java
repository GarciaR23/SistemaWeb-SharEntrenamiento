package edu.utp.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.utp.backend.entity.Documento;

public interface DocumentoRepository extends JpaRepository<Documento, Integer> {

}
