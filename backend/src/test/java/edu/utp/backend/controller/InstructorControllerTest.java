package edu.utp.backend.controller;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
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

import edu.utp.backend.entity.Instructor;
import edu.utp.backend.entity.Usuario;
import edu.utp.backend.service.InstructorService;
import jakarta.transaction.Transactional;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class InstructorControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;
    private MockMvc mockMvc;
    @Autowired
    @MockBean
    private InstructorService instructorService;

    @BeforeEach
    void setUp() {
        this.mockMvc = webAppContextSetup(webApplicationContext).build();
    }

    // Contendido
    private Instructor crearInstructorRespuesta() {
        Usuario user = new Usuario();
        user.setId(1);
        user.setEmail("instructor@test.com");
        user.setContraseña("123456");
        user.setRol("instructor");
        user.setEstadoCuenta("activo");

        Instructor instructor = new Instructor();
        instructor.setIdInstructor(1);
        instructor.setUsuario(user);
        instructor.setNombreCompleto("Juan Perez");
        instructor.setEspecialidad(new String[]{"Fitness"});
        instructor.setBiografiaInstructor(
            "Especialidado en Fitness desde media de cada");
        return instructor;
    }

    @Test
    void testGetInstructorEndpointContent() throws Exception{
        Instructor instructor = crearInstructorRespuesta();
        when(instructorService.findAll()).thenReturn(List.of(instructor));

        this.mockMvc.perform(get("/api/instructores"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Juan Perez")));
        
    }

    // CRUD
    //Get
    @Test
    void testGetInstructores() throws Exception {
        this.mockMvc.perform(get("/api/instructores"))
                .andExpect(status().isOk());
    }

    //Post
    @Test
    void testPostInstructorEndpoint() throws Exception {
        Instructor instructor = crearInstructorRespuesta();
        when(instructorService.create(org.mockito.ArgumentMatchers.any(Instructor.class)))
                .thenReturn(instructor);

        String newInstructor = """
            {
                "usuario": {"id": 1},
                "nombreCompleto": "Juan Perez",
                "especialidad": ["Fitness"],
                "biografiaInstructor": "Especialidado en Fitness desde media de cada"
            }
        """;
        this.mockMvc.perform(
            post("/api/instructores")
                .contentType("application/json")
                .content(newInstructor))
                .andExpect(status().isCreated());
    }

    //Put
    @Test
    void testPutInstructorEndpoint() throws Exception {
        Instructor instructor = crearInstructorRespuesta();
        when(instructorService.update(org.mockito.ArgumentMatchers.eq(1), org.mockito.ArgumentMatchers.any(Instructor.class)))
                .thenReturn(instructor);

        String updatedInstructor = """
            {
                "usuario": {"id": 1},
                "nombreCompleto": "Juan Perez Actualizado",
                "especialidad": ["Fitness", "Yoga"],
                "biografiaInstructor": "Especialidado en Fitness y Yoga desde media de cada"
            }
        """;

        this.mockMvc.perform(
            put("/api/instructores/1")
                .contentType("application/json")
                .content(updatedInstructor))
                .andExpect(status().isOk());
    }

    //Delete
    @Test
    void testDeleteInstructor() throws Exception {
        doNothing().when(instructorService).delete(1);

        this.mockMvc.perform(
            delete("/api/instructores/1"))
            .andExpect(status().isNoContent());
    }

}
