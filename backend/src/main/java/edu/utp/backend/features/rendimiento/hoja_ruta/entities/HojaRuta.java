package edu.utp.backend.features.rendimiento.hoja_ruta.entities;

import java.time.LocalDateTime;

import org.hibernate.annotations.ColumnTransformer;

import edu.utp.backend.features.rendimiento.hoja_ruta.enums.EstadoHoja;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "hoja_ruta")
public class HojaRuta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ruta")
    private Integer idRuta;

    @Column(name = "id_reserva", nullable = false)
    private Integer idReserva;

    @Column(name = "id_detalle", unique = true)
    private Integer idDetalle;

    @Enumerated(EnumType.STRING)
    @ColumnTransformer(write = "?::tipo_estado_hoja")
    @Column(name = "estado_hoja", columnDefinition = "tipo_estado_hoja DEFAULT 'pendiente_envio'")
    private EstadoHoja estadoHoja;

    @Column(name = "fecha_creacion", insertable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion", insertable = false, updatable = false)
    private LocalDateTime fechaActualizacion;
}