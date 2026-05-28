package edu.utp.backend.features.instructor.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.utp.backend.features.instructor.dtos.InstructorRequest;
import edu.utp.backend.features.instructor.dtos.InstructorResponse;
import edu.utp.backend.features.instructor.entities.Instructor;
import edu.utp.backend.features.instructor.repositories.InstructorRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InstructorServiceImpl implements InstructorService {

    private final InstructorRepository instructorRepository;

    @Override
    public List<InstructorResponse> findAll() {
        return instructorRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public InstructorResponse findById(Integer id) {
        return instructorRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Instructor no encontrado: " + id));
    }

    @Override
    @Transactional
    public InstructorResponse create(InstructorRequest request) {
        Instructor instructor = new Instructor();
        applyRequest(instructor, request);
        return toResponse(instructorRepository.save(instructor));
    }

    @Override
    @Transactional
    public InstructorResponse update(Integer id, InstructorRequest request) {
        Instructor instructor = instructorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Instructor no encontrado: " + id));
        applyRequest(instructor, request);
        return toResponse(instructorRepository.save(instructor));
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        instructorRepository.deleteById(id);
    }

    private void applyRequest(Instructor instructor, InstructorRequest request) {
        instructor.setIdUsuario(request.idUsuario());
        instructor.setNombreCompleto(request.nombreCompleto());
        instructor.setUrlImagenPerfil(request.urlImagenPerfil());
        instructor.setEspecialidad(request.especialidad());
        instructor.setBiografia(request.biografia());
        instructor.setDistrito(request.distrito());
        instructor.setDireccion(request.direccion());
    }

    private InstructorResponse toResponse(Instructor instructor) {
        return new InstructorResponse(
                instructor.getIdInstructor(),
                instructor.getIdUsuario(),
                instructor.getNombreCompleto(),
                instructor.getUrlImagenPerfil(),
                instructor.getEspecialidad(),
                instructor.getBiografia(),
                instructor.getDistrito(),
                instructor.getDireccion());
    }
}