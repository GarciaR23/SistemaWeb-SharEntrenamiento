package edu.utp.backend.features.admin.reporte.entities;

import java.time.ZonedDateTime;

import org.hibernate.annotations.Immutable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

@Entity
@Immutable
@Getter
@Table(name = "vista_admin_tabla_pacientes", schema = "public")
public class VistaMonitoreoPaciente {

    @Id
    @Column(name = "id_paciente")
    private Integer idPaciente;

    @Column(name = "nombre_paciente")
    private String nombrePaciente;

    @Column(name = "url_imagen_paciente")
    private String urlImagenPaciente;

    @Column(name = "nombre_tutor")
    private String nombreTutor;

    @Column(name = "estado_cuenta")
    private String estadoCuenta;

    @Column(name = "historial_sesiones")
    private Long historialSesiones;

    @Column(name = "condicion")
    private String condicion;

    @Column(name = "imagenes_instructores")
    private String imagenesInstructores;

    @Column(name = "ultimo_login")
    private ZonedDateTime ultimoLogin;

    @Column(name = "fecha_registro")
    private ZonedDateTime fechaRegistro;
}