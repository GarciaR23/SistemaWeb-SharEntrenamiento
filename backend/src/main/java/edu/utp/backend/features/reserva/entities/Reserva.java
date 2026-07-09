package edu.utp.backend.features.reserva.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.ColumnTransformer;

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

    @ColumnTransformer(read = "total_horas_acumuladas::text", write = "?::interval")
    @Column(name = "total_horas_acumuladas", nullable = false, columnDefinition = "interval")
    private String totalHorasAcumuladas;

    @Column(name = "monto_total_acumulado", nullable = false)
    private BigDecimal montoTotalAcumulado;

    @ColumnTransformer(write = "?::estado_reserva_enum")
    @Column(name = "estado_reserva", nullable = false, columnDefinition = "estado_reserva_enum")
    private String estadoReserva;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_revision")
    private LocalDateTime fechaRevision;

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