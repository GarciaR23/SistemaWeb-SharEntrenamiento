package edu.utp.backend.entity;

import java.math.BigDecimal;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "servicio_instructor")
public class ServicioInstructor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_servicio")
    private Integer idServicio;

    @ManyToOne
    @JoinColumn(name = "id_instructor", nullable = false)
    private Instructor instructor;
    @Column(name = "tarifa_hora", nullable = false, precision = 10, scale = 2)
    private BigDecimal tarifaHora;
    @Column(name = "horario_preferencia", nullable = false)
    private String horarioPreferencia;
    @Column(name = "dia_disponible", nullable = false, length = 20)
    private String diaDisponible;
    @Column(name = "horario_inicio", nullable = false)
    private LocalTime horarioInicio;    
    @Column(name = "horario_final", nullable = false)
    private LocalTime horarioFinal;
}
