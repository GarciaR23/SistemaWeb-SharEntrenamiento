package edu.utp.backend.features.rendimiento.rutina.entities;

import java.time.Duration;

import org.hibernate.annotations.ColumnTransformer;

import edu.utp.backend.features.rendimiento.hoja_ruta.entities.HojaRuta;
import edu.utp.backend.features.rendimiento.rutina.enums.TipoCategoriaEjercicio;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "detalle_rutina")
public class DetalleRutina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle")
    private Integer idDetalle;

    @ManyToOne
    @JoinColumn(name = "id_ruta", nullable = false)
    private HojaRuta hojaRuta;

    @Column(name = "nombre_ejercicio", nullable = false, length = 100)
    private String nombreEjercicio;

    @Enumerated(EnumType.STRING)
    @ColumnTransformer(write = "?::tipo_ejercicio")
    @Column(name = "tipo_ejercicio", nullable = false, columnDefinition = "tipo_ejercicio")
    private TipoCategoriaEjercicio tipoEjercicio;

    @Column(name = "descripcion_ejercicio", columnDefinition = "TEXT")
    private String descripcionEjercicio;

    @JdbcTypeCode(SqlTypes.INTERVAL_SECOND)
    @Column(name = "duracion_estimada", nullable = false)
    private Duration duracionEstimada;
}