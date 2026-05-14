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
import edu.utp.backend.entity.SensibilidadPaciente;
import edu.utp.backend.service.SensibilidadPacienteService;
import jakarta.transaction.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class SensibilidadPacienteControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @MockBean
    private SensibilidadPacienteService sensibilidadPacienteService;

    @BeforeEach
    void setUp() {
        this.mockMvc = webAppContextSetup(webApplicationContext).build();
    }

    private SensibilidadPaciente crearSensibilidadRespuesta() {
        Paciente paciente = new Paciente();
        paciente.setIdPaciente(1);

        SensibilidadPaciente sensibilidad = new SensibilidadPaciente();
        sensibilidad.setIdSensibilidad(1);
        sensibilidad.setPaciente(paciente);
        sensibilidad.setTipoSensibilidad("Ruidos fuertes");

        return sensibilidad;
    }

    @Test
    void testGetSensibilidadesEndpointContent() throws Exception {
        SensibilidadPaciente sensibilidad = crearSensibilidadRespuesta();

        when(sensibilidadPacienteService.findAll()).thenReturn(List.of(sensibilidad));

        this.mockMvc.perform(get("/api/sensibilidades"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Ruidos fuertes")));
    }

    @Test
    void testGetSensibilidadesEndpoint() throws Exception {
        when(sensibilidadPacienteService.findAll()).thenReturn(List.of());

        this.mockMvc.perform(get("/api/sensibilidades"))
                .andExpect(status().isOk());
    }

    @Test
    void testPostSensibilidadEndpoint() throws Exception {
        SensibilidadPaciente sensibilidad = crearSensibilidadRespuesta();

        when(sensibilidadPacienteService.create(any(SensibilidadPaciente.class))).thenReturn(sensibilidad);

        String nuevaSensibilidad = """
                {
                    "paciente": {
                        "idPaciente": 1
                    },
                    "tipoSensibilidad": "Ruidos fuertes"
                }
                """;

        this.mockMvc.perform(
                post("/api/sensibilidades")
                        .contentType("application/json")
                        .content(nuevaSensibilidad))
                .andExpect(status().isCreated());
    }
}
