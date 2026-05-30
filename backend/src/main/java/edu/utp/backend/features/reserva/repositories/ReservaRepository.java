package edu.utp.backend.features.reserva.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.utp.backend.features.reserva.entities.Reserva;

public interface ReservaRepository extends JpaRepository<Reserva, Integer> {
}