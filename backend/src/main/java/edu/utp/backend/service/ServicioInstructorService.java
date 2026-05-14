package edu.utp.backend.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import edu.utp.backend.entity.Instructor;
import edu.utp.backend.entity.ServicioInstructor;
import edu.utp.backend.repository.InstructorRepository;
import edu.utp.backend.repository.ServicioInstructorRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServicioInstructorService {

	private final ServicioInstructorRepository servicioInstructorRepository;
	private final InstructorRepository instructorRepository;

	public List<ServicioInstructor> findAll() {
		return servicioInstructorRepository.findAll();
	}

	public ServicioInstructor findById(Integer id) {
		return servicioInstructorRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(
						HttpStatus.NOT_FOUND,
						"Id de servicio no encontrado"));
	}

	public ServicioInstructor create(ServicioInstructor servicio) {
		if (servicio.getIdServicio() != null) {
			throw new ResponseStatusException(
					HttpStatus.BAD_REQUEST,
					"El servicio ya tiene un ID asignado");
		}

		validarCampos(servicio);

		Instructor instructor = buscarInstructor(servicio.getInstructor());
		servicio.setInstructor(instructor);

		return servicioInstructorRepository.save(servicio);
	}

	public ServicioInstructor update(Integer id, ServicioInstructor servicio) {
		ServicioInstructor aux = servicioInstructorRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(
						HttpStatus.NOT_FOUND,
						"Id de servicio no encontrado"));

		validarCampos(servicio);

		if (servicio.getInstructor() != null &&
				servicio.getInstructor().getIdInstructor() != null) {
			Instructor instructor = buscarInstructor(servicio.getInstructor());
			aux.setInstructor(instructor);
		}

		aux.setTarifaHora(servicio.getTarifaHora());
		aux.setHorarioPreferencia(servicio.getHorarioPreferencia());
		aux.setDiaDisponible(servicio.getDiaDisponible());
		aux.setHorarioInicio(servicio.getHorarioInicio());
		aux.setHorarioFinal(servicio.getHorarioFinal());

		return servicioInstructorRepository.save(aux);
	}

	public void delete(Integer id) {
		ServicioInstructor servicio = servicioInstructorRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(
						HttpStatus.NOT_FOUND,
						"Id de servicio no encontrado"));

		servicioInstructorRepository.deleteById(servicio.getIdServicio());
	}

	private Instructor buscarInstructor(Instructor instructor) {
		if (instructor == null || instructor.getIdInstructor() == null) {
			throw new ResponseStatusException(
					HttpStatus.BAD_REQUEST,
					"Debe proporcionar un id_instructor válido");
		}

		return instructorRepository.findById(instructor.getIdInstructor())
				.orElseThrow(() -> new ResponseStatusException(
						HttpStatus.NOT_FOUND,
						"Instructor no encontrado"));
	}

	private void validarCampos(ServicioInstructor servicio) {
		if (servicio.getTarifaHora() == null) {
			throw new ResponseStatusException(
					HttpStatus.BAD_REQUEST,
					"Debe proporcionar una tarifa por hora válida");
		}

		if (servicio.getHorarioPreferencia() == null ||
				servicio.getHorarioPreferencia().isBlank()) {
			throw new ResponseStatusException(
					HttpStatus.BAD_REQUEST,
					"Debe proporcionar un horario de preferencia válido");
		}

		String pref = servicio.getHorarioPreferencia().trim().toLowerCase();
		if (!pref.equals("virtual") && !pref.equals("presencial")) {
			throw new ResponseStatusException(
					HttpStatus.BAD_REQUEST,
					"El campo horarioPreferencia debe ser 'virtual' o 'presencial'");
		}

		if (servicio.getDiaDisponible() == null ||
				servicio.getDiaDisponible().isBlank()) {
			throw new ResponseStatusException(
					HttpStatus.BAD_REQUEST,
					"Debe proporcionar un día disponible válido");
		}

		if (servicio.getHorarioInicio() == null) {
			throw new ResponseStatusException(
					HttpStatus.BAD_REQUEST,
					"Debe proporcionar un horario de inicio válido");
		}

		if (servicio.getHorarioFinal() == null) {
			throw new ResponseStatusException(
					HttpStatus.BAD_REQUEST,
					"Debe proporcionar un horario final válido");
		}
	}

}
