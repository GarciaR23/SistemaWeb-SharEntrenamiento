package edu.utp.backend.features.sede.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import edu.utp.backend.features.sede.entities.Sede;

public interface SedeRepository extends JpaRepository<Sede, Integer> {

        List<Sede> findByIdInstructorOrderByIdSedeDesc(Integer idInstructor);

        List<Sede> findByIdInstructorAndDistritoSedeContainingIgnoreCaseOrderByIdSedeDesc(
                        Integer idInstructor,
                        String distritoSede);

        List<Sede> findByIdInstructorAndDireccionSedeContainingIgnoreCaseOrderByIdSedeDesc(
                        Integer idInstructor,
                        String direccionSede);

        @Query("SELECT COUNT(s) FROM Sede s WHERE s.idInstructor = :idInstructor AND s.estadoActivacion = true")
        long countActivasByInstructor(@Param("idInstructor") Integer idInstructor);
}