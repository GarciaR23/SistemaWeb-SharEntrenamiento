package edu.utp.backend.controller;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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

import edu.utp.backend.entity.Paciente;
import edu.utp.backend.service.PacienteService;
import jakarta.transaction.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class PacienteControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @MockBean
    private PacienteService pacienteService;

    @BeforeEach
    void setUp() {
        this.mockMvc = webAppContextSetup(webApplicationContext).build();
    }

    private Paciente crearPacienteRespuesta() {
        Paciente paciente = new Paciente();
        paciente.setIdPaciente(1);
        paciente.setNombrePaciente("Mateo");
        paciente.setCondicionDiagnostico("TEA");
        paciente.setGradoAutismo("Moderado");
        paciente.setGenero("Masculino");
        paciente.setEdad(10);

        return paciente;
    }

    @Test
    void testGetPacientesEndpointContent() throws Exception {
        Paciente paciente = crearPacienteRespuesta();

        when(pacienteService.findAll()).thenReturn(List.of(paciente));

        this.mockMvc.perform(get("/api/pacientes"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Mateo")));
    }

    @Test
    void testGetPacientesEndpoint() throws Exception {
        when(pacienteService.findAll()).thenReturn(List.of());

        this.mockMvc.perform(get("/api/pacientes"))
                .andExpect(status().isOk());
    }

    @Test
    void testPostPacienteEndpoint() throws Exception {
        Paciente paciente = crearPacienteRespuesta();

        when(pacienteService.create(any(Paciente.class))).thenReturn(paciente);

        String nuevoPaciente = """
                {
                    "tutor": {
                        "idTutor": 1
                    },
                    "nombre": "Mateo",
                    "condicion": "TEA",
                    "gradoAutismo": "Moderado",
                    "genero": "Masculino",
                    "edad": 10
                }
                """;

        this.mockMvc.perform(
                post("/api/pacientes")
                        .contentType("application/json")
                        .content(nuevoPaciente))
                .andExpect(status().isCreated());
    }
}
