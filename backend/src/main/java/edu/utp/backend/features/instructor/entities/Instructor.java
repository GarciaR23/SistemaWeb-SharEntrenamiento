package edu.utp.backend.features.instructor.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Data
@Table(name = "instructor")
public class Instructor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_instructor", nullable = false)
    private Integer idInstructor;

    @Column(name = "id_usuario", nullable = false, unique = true)
    private Long idUsuario;

    @Column(name = "nombre_completo", nullable = false)
    private String nombreCompleto;

    @Column(name = "url_imagen_perfil")
    private String urlImagenPerfil;

    @Column(name = "especialidad")
    private String especialidad;

    @Column(name = "biografia_instructor")
    private String biografia;

    @Column(name = "distrito", nullable = false)
    private String distrito;

    @Column(name = "direccion", nullable = false)
    private String direccion;
}
