package edu.utp.backend.controller;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;

import edu.utp.backend.entities.Usuario;
import edu.utp.backend.repositories.UsuarioRepository;
import jakarta.transaction.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class UsuarioControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;
    private MockMvc mockMvc;
    @Autowired
    private UsuarioRepository userRepo;

    @BeforeEach
    void setUp() {
        this.mockMvc = webAppContextSetup(webApplicationContext).build();
    }

    // Contendido
    @Test
    void testGetUserEndpointContent() throws Exception {
        Usuario user = new Usuario();
        user.setEmail("test@correo.com");
        user.setContraseña("123456");
        user.setRol("tutor");
        user.setEstadoCuenta("activo");

        userRepo.save(user);

        this.mockMvc.perform(get("/api/usuarios"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("test@correo.com")));
    }

    // CRUD
    //Get
    @Test
    void testGetUserEndpoint() throws Exception {
        this.mockMvc.perform(get("/api/usuarios"))
                .andExpect(status().isOk());
    }

    //Post
    @Test
    void testPostUserEndpoint() throws Exception {
        String nuevoUsuario = """
                {
                    "email":"nuevo@correo.com",
                    "contraseña":"123456",
                    "rol":"tutor",
                    "estadoCuenta":"activo"
                }
                """;

        this.mockMvc.perform(
                post("/api/usuarios")
                        .contentType("application/json")
                        .content(nuevoUsuario))
                .andExpect(status().isCreated());
    }

    //Put
    @Test
    void testPutUserEndpoint() throws Exception {
        Usuario user = new Usuario();
        user.setEmail("old@correo.com");
        user.setContraseña("123");
        user.setRol("tutor");
        user.setEstadoCuenta("activo");

        Usuario guardado = userRepo.save(user);

        String actualizado = """
                {
                    "email":"new@correo.com",
                    "contraseña":"999999",
                    "rol":"instructor",
                    "estadoCuenta":"activo"
                }
                """;

        this.mockMvc.perform(
                put("/api/usuarios/" + guardado.getId())
                        .contentType("application/json")
                        .content(actualizado))
                .andExpect(status().isOk());
    }

    //Delete
    @Test
    void testDeleteUserEndpoint() throws Exception {
        Usuario user = new Usuario();
        user.setEmail("new@correo.com");
        user.setContraseña("999999");
        user.setRol("tutor");
        user.setEstadoCuenta("activo");

        Usuario guardado = userRepo.save(user);

        this.mockMvc.perform(
                delete("/api/usuarios/" + guardado.getId()))
            .andExpect(status().isNoContent());
    }

}
