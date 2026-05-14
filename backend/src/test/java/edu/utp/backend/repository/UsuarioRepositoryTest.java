package edu.utp.backend.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import edu.utp.backend.entities.Usuario;

@DataJpaTest
class UsuarioRepositoryTest {

    @Autowired
    private UsuarioRepository userRepo;

    @Test
    void testSaveAndFindById() {
        Usuario user = new Usuario();
        user.setEmail("test@correo.com");
        user.setContraseña("123456");
        user.setRol("tutor");
        user.setEstadoCuenta("activo");

        Usuario guardado = userRepo.save(user);

        Usuario encontrado = userRepo.findById(guardado.getId()).orElse(null);

        assertNotNull(encontrado);
        assertEquals("test@correo.com", encontrado.getEmail());
    }
}