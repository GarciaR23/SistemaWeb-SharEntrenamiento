package edu.utp.backend.features.pago.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.utp.backend.features.pago.entities.Pago;

public interface PagoRepository extends JpaRepository<Pago, Integer> {
}