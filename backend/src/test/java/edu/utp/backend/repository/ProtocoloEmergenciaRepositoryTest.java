package edu.utp.backend.repository;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import edu.utp.backend.entity.Paciente;
import edu.utp.backend.entity.ProtocoloEmergencia;
import edu.utp.backend.entity.Tutor;
import edu.utp.backend.entity.Usuario;

@DataJpaTest
public class ProtocoloEmergenciaRepositoryTest {

    @Autowired
    private ProtocoloEmergenciaRepository protocoloRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private TutorRepository tutorRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private Usuario crearUsuarioTutor() {
        Usuario usuario = new Usuario();
        usuario.setEmail("tutor@test.com");
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
    void debeGuardarProtocolo() {
        Paciente paciente = crearPaciente();

        ProtocoloEmergencia protocolo = new ProtocoloEmergencia();
        protocolo.setPaciente(paciente);
        protocolo.setDescripcion("Reducir estímulos");

        ProtocoloEmergencia guardado = protocoloRepository.save(protocolo);

        assertNotNull(guardado.getIdProtocolo());
    }

    @Test
    void debeLeerProtocolo() {
        Paciente paciente = crearPaciente();

        ProtocoloEmergencia protocolo = new ProtocoloEmergencia();
        protocolo.setPaciente(paciente);
        protocolo.setDescripcion("Reducir estímulos");

        ProtocoloEmergencia guardado = protocoloRepository.save(protocolo);

        ProtocoloEmergencia encontrado =
                protocoloRepository.findById(guardado.getIdProtocolo()).orElse(null);

        assertNotNull(encontrado);
        assertEquals("Reducir estímulos", encontrado.getDescripcion());
    }

    @Test
    void debeEditarProtocolo() {
        Paciente paciente = crearPaciente();

        ProtocoloEmergencia protocolo = new ProtocoloEmergencia();
        protocolo.setPaciente(paciente);
        protocolo.setDescripcion("Reducir estímulos");

        ProtocoloEmergencia guardado = protocoloRepository.save(protocolo);

        guardado.setDescripcion("Mantener calma");

        ProtocoloEmergencia actualizado = protocoloRepository.save(guardado);

        assertEquals("Mantener calma", actualizado.getDescripcion());
    }

    @Test
    void debeEliminarProtocolo() {
        Paciente paciente = crearPaciente();

        ProtocoloEmergencia protocolo = new ProtocoloEmergencia();
        protocolo.setPaciente(paciente);
        protocolo.setDescripcion("Reducir estímulos");

        ProtocoloEmergencia guardado = protocoloRepository.save(protocolo);
        Integer id = guardado.getIdProtocolo();

        protocoloRepository.deleteById(id);

        assertFalse(protocoloRepository.findById(id).isPresent());
    }
}