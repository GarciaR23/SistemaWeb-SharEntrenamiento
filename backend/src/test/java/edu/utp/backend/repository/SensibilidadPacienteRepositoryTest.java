package edu.utp.backend.repository;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import edu.utp.backend.entity.Paciente;
import edu.utp.backend.entity.SensibilidadPaciente;
import edu.utp.backend.entity.Tutor;
import edu.utp.backend.entity.Usuario;

@DataJpaTest
public class SensibilidadPacienteRepositoryTest {

    @Autowired
    private SensibilidadPacienteRepository sensibilidadRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private TutorRepository tutorRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private Usuario crearUsuarioTutor() {
        Usuario usuario = new Usuario();
        usuario.setEmail("sensibilidad@test.com");
        usuario.setContraseña("123456");
        usuario.setRol("tutor");
        usuario.setEstadoCuenta("activo");
        return usuarioRepository.save(usuario);
    }

    private Tutor crearTutor() {
        Usuario usuario = crearUsuarioTutor();

        Tutor tutor = new Tutor();
        tutor.setUsuario(usuario);
        tutor.setNombre("Tutor Mateo");
        return tutorRepository.save(tutor);
    }

    private Paciente crearPaciente() {
        Tutor tutor = crearTutor();

        Paciente paciente = new Paciente();
        paciente.setNombreCompleto("Mateo");
        paciente.setNombrePaciente("Mateo");
        paciente.setCondicionDiagnostico("TEA");
        paciente.setGradoAutismo("Moderado");
        paciente.setGenero("Masculino");
        paciente.setEdad(10);
        paciente.setTutor(tutor);

        return pacienteRepository.save(paciente);
    }

    @Test
    void debeGuardarSensibilidad() {
        Paciente paciente = crearPaciente();

        SensibilidadPaciente sensibilidad = new SensibilidadPaciente();
        sensibilidad.setPaciente(paciente);
        sensibilidad.setTipoSensibilidad("Ruidos fuertes");

        SensibilidadPaciente guardado = sensibilidadRepository.save(sensibilidad);

        assertNotNull(guardado.getIdSensibilidad());
    }

    @Test
    void debeLeerSensibilidad() {
        Paciente paciente = crearPaciente();

        SensibilidadPaciente sensibilidad = new SensibilidadPaciente();
        sensibilidad.setPaciente(paciente);
        sensibilidad.setTipoSensibilidad("Ruidos fuertes");

        SensibilidadPaciente guardado = sensibilidadRepository.save(sensibilidad);

        SensibilidadPaciente encontrado =
                sensibilidadRepository.findById(guardado.getIdSensibilidad()).orElse(null);

        assertNotNull(encontrado);
        assertEquals("Ruidos fuertes", encontrado.getTipoSensibilidad());
    }

    @Test
    void debeEditarSensibilidad() {
        Paciente paciente = crearPaciente();

        SensibilidadPaciente sensibilidad = new SensibilidadPaciente();
        sensibilidad.setPaciente(paciente);
        sensibilidad.setTipoSensibilidad("Ruidos fuertes");

        SensibilidadPaciente guardado = sensibilidadRepository.save(sensibilidad);

        guardado.setTipoSensibilidad("Luces brillantes");

        SensibilidadPaciente actualizado = sensibilidadRepository.save(guardado);

        assertEquals("Luces brillantes", actualizado.getTipoSensibilidad());
    }

    @Test
    void debeEliminarSensibilidad() {
        Paciente paciente = crearPaciente();

        SensibilidadPaciente sensibilidad = new SensibilidadPaciente();
        sensibilidad.setPaciente(paciente);
        sensibilidad.setTipoSensibilidad("Ruidos fuertes");

        SensibilidadPaciente guardado = sensibilidadRepository.save(sensibilidad);
        Integer id = guardado.getIdSensibilidad();

        sensibilidadRepository.deleteById(id);

        assertFalse(sensibilidadRepository.findById(id).isPresent());
    }
}