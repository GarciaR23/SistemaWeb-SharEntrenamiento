package edu.utp.backend.features.admin.solicitud.entities;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.ZonedDateTime;

import org.hibernate.annotations.Immutable;

@Entity
@Immutable 
@Getter
@Table(name = "vista_admin_cards_solicitudes", schema = "public")
public class VistaAdminSolicitud {

    @Id
    @Column(name = "id_instructor")
    private Integer idInstructor;

    @Column(name = "instructor_nombre")
    private String instructorNombre;

    @Column(name = "url_imagen_perfil")
    private String urlImagenPerfil;

    private String especialidad;

    @Column(name = "estado_usuario")
    private String estadoUsuario;

    @Column(name = "total_documentos_enviados")
    private Long totalDocumentosEnviados;

    @Column(name = "fecha_ultimo_envio")
    private ZonedDateTime fechaUltimoEnvio;

}