package edu.utp.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.utp.backend.entity.Instructor;

public interface InstructorRepository extends JpaRepository<Instructor, Integer> {

}
