package edu.utp.backend.repository;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import edu.utp.backend.entity.Paciente;
import edu.utp.backend.entity.Tutor;
import edu.utp.backend.entity.Usuario;

@DataJpaTest
public class PacienteRepositoryTest {

    @Autowired
    private PacienteRepository repository;

    @Autowired
    private TutorRepository tutorRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private Usuario crearUsuarioTutor() {
        Usuario usuario = new Usuario();
        usuario.setEmail("tutorpaciente@test.com");
        usuario.setContraseña("123456");
        usuario.setRol("tutor");
        usuario.setEstadoCuenta("activo");
        return usuarioRepository.save(usuario);
    }

    private Tutor crearTutorBase() {
        Usuario usuario = crearUsuarioTutor();

        Tutor tutor = new Tutor();
        tutor.setUsuario(usuario);
        tutor.setNombre("Tutor Mateo");
        return tutorRepository.save(tutor);
    }

    private Paciente crearPacienteBase() {
        Tutor tutor = crearTutorBase();

        Paciente paciente = new Paciente();
        paciente.setNombreCompleto("Mateo");
        paciente.setNombrePaciente("Mateo");
        paciente.setCondicionDiagnostico("TEA");
        paciente.setGradoAutismo("Moderado");
        paciente.setGenero("Masculino");
        paciente.setEdad(10);
        paciente.setTutor(tutor);
        return paciente;
    }

    @Test
    void debeGuardarPaciente() {
        Paciente guardado = repository.save(crearPacienteBase());

        assertNotNull(guardado.getIdPaciente());
        assertEquals("Mateo", guardado.getNombrePaciente());
    }

    @Test
    void debeLeerPaciente() {
        Paciente guardado = repository.save(crearPacienteBase());

        Paciente encontrado = repository.findById(guardado.getIdPaciente()).orElse(null);

        assertNotNull(encontrado);
        assertEquals("Mateo", encontrado.getNombrePaciente());
    }

    @Test
    void debeEditarPaciente() {
        Paciente guardado = repository.save(crearPacienteBase());

        guardado.setNombrePaciente("Mateo Actualizado");
        guardado.setNombreCompleto("Mateo Actualizado");
        guardado.setEdad(11);

        Paciente actualizado = repository.save(guardado);

        assertEquals("Mateo Actualizado", actualizado.getNombrePaciente());
        assertEquals("Mateo Actualizado", actualizado.getNombreCompleto());
        assertEquals(11, actualizado.getEdad());
    }

    @Test
    void debeEliminarPaciente() {
        Paciente guardado = repository.save(crearPacienteBase());
        Integer id = guardado.getIdPaciente();

        repository.deleteById(id);

        assertFalse(repository.findById(id).isPresent());
    }
}