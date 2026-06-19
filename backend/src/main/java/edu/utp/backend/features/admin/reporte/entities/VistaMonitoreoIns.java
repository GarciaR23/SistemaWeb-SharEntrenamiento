package edu.utp.backend.features.admin.reporte.entities;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

import org.hibernate.annotations.Immutable;
import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Immutable
@Getter
@Table(name = "vista_admin_tabla_instructores", schema = "public")
public class VistaMonitoreoIns {

    @Id
    @Column(name = "id_instructor")
    private Integer idInstructor;

    @Column(name = "nombre_completo")
    private String nombreCompleto;

    @Column(name = "url_imagen_perfil")
    private String urlImagen;

    @Column(name = "especialidad")
    private String especialidad;

    @Column(name = "estado_cuenta")
    private String estadoCuenta;

    @Column(name = "puntaje", columnDefinition = "numeric")
    private BigDecimal puntaje;

    @Column(name = "numero_sesiones")
    private Long numeroSesion;

    @Column(name = "fecha_registro")
    private ZonedDateTime fechaRegistro;
}

