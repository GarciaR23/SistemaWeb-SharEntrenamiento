package edu.utp.backend.features.paciente.entities;

import org.hibernate.annotations.ColumnTransformer;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "sensibilidad_paciente")
public class SensibilidadPaciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sensibilidad")
    private Integer idSensibilidad;

    @Column(name = "id_paciente", nullable = false)
    private Integer idPaciente;

    @ColumnTransformer(write = "?::tipo_sensibilidad")
    @Column(name = "tipo_sensibilidad", nullable = false, columnDefinition = "tipo_sensibilidad")
    private String tipoSensibilidad;
}