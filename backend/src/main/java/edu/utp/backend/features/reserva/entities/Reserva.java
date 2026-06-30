package edu.utp.backend.features.reserva.entities;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    @Column(name = "duracion_entrenamiento", nullable = false, columnDefinition = "interval")
    private Duration duracionEntrenamiento;

    @Column(name = "monto_total", nullable = false)
    private BigDecimal montoTotal;

    @Column(name = "estado_reserva", nullable = false, length = 20)
    private String estadoReserva;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist
    public void prePersist() {
        if (fechaCreacion == null) {
            fechaCreacion = LocalDateTime.now();
        }

        if (estadoReserva == null || estadoReserva.isBlank()) {
            estadoReserva = "pendiente";
        }
    }
}