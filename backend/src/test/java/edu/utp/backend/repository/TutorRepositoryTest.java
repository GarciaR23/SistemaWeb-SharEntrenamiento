package edu.utp.backend.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import edu.utp.backend.entities.Tutor;
import edu.utp.backend.entities.Usuario;

@DataJpaTest
public class TutorRepositoryTest {

    @Autowired
    private TutorRepository tutorRepo;

    @Autowired
    private UsuarioRepository userRepo;

    @Test
    void testSaveAndFindTutorById() {

        // FK usuario obligatorio
        Usuario user = new Usuario();
        user.setEmail("tutorrepo@test.com");
        user.setContraseña("123456");
        user.setRol("tutor");
        user.setEstadoCuenta("activo");

        Usuario usuarioGuardado = userRepo.save(user);

        Tutor tutor = new Tutor();
        tutor.setUsuario(usuarioGuardado);
        tutor.setNombre("Carlos Ramirez");

        Tutor guardado = tutorRepo.save(tutor);

        Tutor encontrado = tutorRepo.findById(
                guardado.getIdTutor()).orElse(null);

        assertNotNull(encontrado);

        assertEquals(
                "Carlos Ramirez",
                encontrado.getNombre());

        assertEquals(
                usuarioGuardado.getId(),
                encontrado.getUsuario().getId());
    }
}