package edu.utp.backend.features.reserva.entities;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Data
@NoArgsConstructor
@Entity
@Table(name = "reserva")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reserva")
    private Integer idReserva;

    @Column(name = "id_paciente", nullable = false)
    private Integer idPaciente;

    @Column(name = "id_instructor", nullable = false)
    private Integer idInstructor;

    @Column(name = "id_sede", nullable = false)
    private Integer idSede;

    @Column(name = "seleccion_horario", nullable = false)
    private LocalDateTime seleccionHorario;

    @JdbcTypeCode(SqlTypes.INTERVAL_SECOND)
    @Column(name = "duracion_entrenamiento", nullable = false)
    private Duration duracionEntrenamiento;

    @Column(name = "monto_total", nullable = false)
    private BigDecimal montoTotal;

    @Column(name = "estado_reserva")
    private String estadoReserva = "pendiente";

    @Column(name = "fecha_creacion", insertable = false, updatable = false)
    private LocalDateTime fechaCreacion;
}