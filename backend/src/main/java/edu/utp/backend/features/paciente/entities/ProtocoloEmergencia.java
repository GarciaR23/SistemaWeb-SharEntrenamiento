package edu.utp.backend.features.paciente.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "protocolo_emergencia")
public class ProtocoloEmergencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_protocolo")
    private Integer idProtocolo;

    @Column(name = "id_paciente", nullable = false)
    private Integer idPaciente;

    @Column(name = "descripcion", nullable = false)
    private String descripcion;
}