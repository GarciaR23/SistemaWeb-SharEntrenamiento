package edu.utp.backend.controller;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;

import edu.utp.backend.entity.Tutor;
import edu.utp.backend.entity.Usuario;
import edu.utp.backend.service.TutorService;
import jakarta.transaction.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class TutorControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @MockBean
    private TutorService tutorService;

    @BeforeEach
    void setUp() {
        this.mockMvc = webAppContextSetup(webApplicationContext).build();
    }

    // BASE
    private Tutor crearTutorRespuesta() {
        Usuario user = new Usuario();
        user.setId(1);
        user.setEmail("tutor@test.com");
        user.setContraseña("123456");
        user.setRol("tutor");
        user.setEstadoCuenta("activo");

        Tutor tutor = new Tutor();
        tutor.setIdTutor(1);
        tutor.setUsuario(user);
        tutor.setNombre("Carlos Ramirez");

        return tutor;
    }

    // CONTENT
    @Test
    void testGetTutorEndpointContent() throws Exception {
        Tutor tutor = crearTutorRespuesta();

        when(tutorService.findAll()).thenReturn(List.of(tutor));

        this.mockMvc.perform(get("/api/tutores"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Carlos Ramirez")));
    }

    // GET
    @Test
    void testGetTutoresEndpoint() throws Exception {
        when(tutorService.findAll()).thenReturn(List.of());

        this.mockMvc.perform(get("/api/tutores"))
                .andExpect(status().isOk());
    }

    // POST
    @Test
    void testPostTutorEndpoint() throws Exception {
        Tutor tutor = crearTutorRespuesta();

        when(tutorService.create(any(Tutor.class))).thenReturn(tutor);

        String nuevoTutor = """
                {
                    "usuario": {
                        "id": 1
                    },
                    "nombre": "Carlos Ramirez"
                }
                """;

        this.mockMvc.perform(
                post("/api/tutores")
                        .contentType("application/json")
                        .content(nuevoTutor))
                .andExpect(status().isCreated());
    }

    // PUT
    @Test
    void testPutTutorEndpoint() throws Exception {
        Tutor tutor = crearTutorRespuesta();
        tutor.setNombre("Carlos Actualizado");

        when(tutorService.update(eq(1), any(Tutor.class)))
                .thenReturn(tutor);

        String tutorActualizado = """
                {
                    "usuario": {
                        "id": 1
                    },
                    "nombre": "Carlos Actualizado"
                }
                """;

        this.mockMvc.perform(
                put("/api/tutores/1")
                        .contentType("application/json")
                        .content(tutorActualizado))
                .andExpect(status().isOk());
    }

    // DELETE
    @Test
    void testDeleteTutorEndpoint() throws Exception {
        doNothing().when(tutorService).delete(1);

        this.mockMvc.perform(
                delete("/api/tutores/1"))
                .andExpect(status().isNoContent());
    }
}
