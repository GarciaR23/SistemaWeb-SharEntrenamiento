package edu.utp.backend.features.sede.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "sede")
public class Sede {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sede")
    private Integer idSede;

    @Column(name = "id_instructor", nullable = false)
    private Integer idInstructor;

    @Column(name = "url_imagen_sede_1", nullable = false)
    private String urlImagenSede1;

    @Column(name = "url_imagen_sede_2")
    private String urlImagenSede2;

    @Column(name = "url_imagen_sede_3")
    private String urlImagenSede3;

    @Column(name = "descripcion_sede")
    private String descripcionSede;

    @Column(name = "direccion_sede", nullable = false)
    private String direccionSede;

    @Column(name = "distrito_sede", nullable = false)
    private String distritoSede;

    @Column(name = "estado_activacion")
    private Boolean estadoActivacion = true;
}