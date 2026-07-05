package edu.utp.backend.features.tutor.progreso_paciente.repositories;

import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
public class ProgresoPacienteRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public Object[] findProgresoKpi(Integer idPaciente) {
        return (Object[]) entityManager
                .createNativeQuery("SELECT * FROM fn_paciente_progreso_kpi(:idPaciente)")
                .setParameter("idPaciente", idPaciente)
                .getSingleResult();
    }

    public Object[] findTendenciaKpi(Integer idPaciente) {
        return (Object[]) entityManager
                .createNativeQuery("SELECT * FROM fn_paciente_tendencia_kpi(:idPaciente)")
                .setParameter("idPaciente", idPaciente)
                .getSingleResult();
    }
}