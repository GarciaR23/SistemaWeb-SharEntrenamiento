package edu.utp.backend.features.servicio.entities;

import java.time.LocalTime;

import org.hibernate.annotations.ColumnTransformer;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "horario_disponibilidad")
public class HorarioDisponibilidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_horario")
    private Integer idHorario;

    @Column(name = "id_servicio", nullable = false)
    private Integer idServicio;

    @Column(name = "dia_semana", nullable = false)
    private String diaSemana;

    @ColumnTransformer(write = "?::tipo_horario_preferencia")
    @Column(name = "horario_preferencia", nullable = false, columnDefinition = "tipo_horario_preferencia")
    private String horarioPreferencia;

    @Column(name = "horario_inicio", nullable = false)
    private LocalTime horarioInicio;

    @Column(name = "horario_final", nullable = false)
    private LocalTime horarioFinal;
}