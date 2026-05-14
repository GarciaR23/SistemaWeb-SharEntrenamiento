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
import edu.utp.backend.entity.ProtocoloEmergencia;
import edu.utp.backend.service.ProtocoloEmergenciaService;
import jakarta.transaction.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class ProtocoloEmergenciaControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @MockBean
    private ProtocoloEmergenciaService protocoloEmergenciaService;

    @BeforeEach
    void setUp() {
        this.mockMvc = webAppContextSetup(webApplicationContext).build();
    }

    private ProtocoloEmergencia crearProtocoloRespuesta() {
        Paciente paciente = new Paciente();
        paciente.setIdPaciente(1);

        ProtocoloEmergencia protocolo = new ProtocoloEmergencia();
        protocolo.setIdProtocolo(1);
        protocolo.setPaciente(paciente);
        protocolo.setDescripcion("Mantener la calma y reducir estímulos.");

        return protocolo;
    }

    @Test
    void testGetProtocolosEndpointContent() throws Exception {
        ProtocoloEmergencia protocolo = crearProtocoloRespuesta();

        when(protocoloEmergenciaService.findAll()).thenReturn(List.of(protocolo));

        this.mockMvc.perform(get("/api/protocolos"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Mantener la calma")));
    }

    @Test
    void testGetProtocolosEndpoint() throws Exception {
        when(protocoloEmergenciaService.findAll()).thenReturn(List.of());

        this.mockMvc.perform(get("/api/protocolos"))
                .andExpect(status().isOk());
    }

    @Test
    void testPostProtocoloEndpoint() throws Exception {
        ProtocoloEmergencia protocolo = crearProtocoloRespuesta();

        when(protocoloEmergenciaService.create(any(ProtocoloEmergencia.class))).thenReturn(protocolo);

        String nuevoProtocolo = """
                {
                    "paciente": {
                        "idPaciente": 1
                    },
                    "descripcion": "Mantener la calma y reducir estímulos."
                }
                """;

        this.mockMvc.perform(
                post("/api/protocolos")
                        .contentType("application/json")
                        .content(nuevoProtocolo))
                .andExpect(status().isCreated());
    }
}
