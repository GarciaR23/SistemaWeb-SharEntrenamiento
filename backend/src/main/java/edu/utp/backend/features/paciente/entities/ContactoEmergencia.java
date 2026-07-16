package edu.utp.backend.features.paciente.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "contacto_emergencia")
public class ContactoEmergencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_contacto")
    private Integer idContacto;

    @Column(name = "id_paciente", nullable = false)
    private Integer idPaciente;

    @Column(name = "nombre_contacto", nullable = false)
    private String nombreContacto;

    @Column(name = "telefono", nullable = false)
    private String telefono;

    @Column(name = "relacion", nullable = false)
    private String relacion;
}