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
@Table(name = "detalle_reserva")
public class DetalleReserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle")
    private Integer idDetalle;

    @Column(name = "id_reserva", nullable = false)
    private Integer idReserva;

    @Column(name = "hora_inicio_estimada", nullable = false)
    private LocalDateTime horaInicioEstimada;

    @Column(name = "hora_fin_estimada", nullable = false)
    private LocalDateTime horaFinEstimada;

    @ColumnTransformer(read = "duracion_entrenamiento::text", write = "?::interval")
    @Column(name = "duracion_entrenamiento", nullable = false, columnDefinition = "interval")
    private String duracionEntrenamiento;

    @Column(name = "monto_subtotal", nullable = false)
    private BigDecimal montoSubtotal;

    @ColumnTransformer(write = "?::estado_reserva_enum")
    @Column(name = "estado_detalle", columnDefinition = "estado_reserva_enum DEFAULT 'pendiente'")
    private String estadoDetalle;

    @Column(name = "fecha_revision")
    private LocalDateTime fechaRevision;

    @PrePersist
    public void prePersist() {
        if (estadoDetalle == null || estadoDetalle.isBlank()) {
            estadoDetalle = "pendiente";
        }
    }
}