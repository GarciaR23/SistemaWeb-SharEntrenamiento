package edu.utp.backend.features.instructor.services;

import java.util.List;

import edu.utp.backend.features.instructor.dtos.InstructorRequest;
import edu.utp.backend.features.instructor.dtos.InstructorResponse;

public interface InstructorService {
    List<InstructorResponse> findAll();

    InstructorResponse findById(Integer id);

    InstructorResponse create(InstructorRequest request);

    InstructorResponse update(Integer id, InstructorRequest request);

    void delete(Integer id);
}