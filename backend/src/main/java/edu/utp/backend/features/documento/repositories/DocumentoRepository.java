package edu.utp.backend.features.documento.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.utp.backend.features.documento.entities.Documento;

public interface DocumentoRepository extends JpaRepository<Documento, Long> {
}