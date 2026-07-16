package edu.utp.backend.features.servicio.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.utp.backend.features.servicio.entities.HorarioDisponibilidad;

@Repository
public interface HorarioDisponibilidadRepository extends JpaRepository<HorarioDisponibilidad, Integer> {
}