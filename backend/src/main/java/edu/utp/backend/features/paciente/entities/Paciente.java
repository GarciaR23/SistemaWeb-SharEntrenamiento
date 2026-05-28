package edu.utp.backend.features.paciente.entities;

import org.hibernate.annotations.ColumnTransformer;

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
@Table(name = "paciente")
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_paciente")
    private Integer idPaciente;

    @Column(name = "id_tutor", nullable = false)
    private Integer idTutor;

    @Column(name = "nombre_completo", nullable = false)
    private String nombreCompleto;

    @Column(name = "url_imagen_paciente")
    private String urlImagenPaciente;

    @Column(name = "condicion")
    private String condicion = "autismo";

    @ColumnTransformer(write = "?::tipo_grado")
    @Column(name = "grado_autismo", nullable = false, columnDefinition = "tipo_grado")
    private String gradoAutismo;

    @ColumnTransformer(write = "?::tipo_genero")
    @Column(name = "genero", nullable = false, columnDefinition = "tipo_genero")
    private String genero;

    @Column(name = "edad", nullable = false)
    private Integer edad;

    @Column(name = "distrito", nullable = false)
    private String distrito;

    @Column(name = "direccion", nullable = false)
    private String direccion;
}