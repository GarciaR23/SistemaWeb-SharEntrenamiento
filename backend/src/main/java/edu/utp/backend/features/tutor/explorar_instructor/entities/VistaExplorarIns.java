package edu.utp.backend.features.tutor.explorar_instructor.entities;

import java.math.BigDecimal;
import org.hibernate.annotations.Immutable;
import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Immutable
@Getter
@Table(name = "vista_paciente_explorar_instructores", schema = "public")
public class VistaExplorarIns {
    @Id
    @Column(name = "id_instructor")
    private Integer idInstructor;

    @Column(name = "instructor_nombre")
    private String instructorNombre;

    @Column(name = "instructor_foto")
    private String instructorFoto;

    @Column(name = "especialidad")
    private String especialidad;

    @Column(name = "calificacion_estrellas", columnDefinition = "numeric")
    private BigDecimal calificacionEstrellas;

    @Column(name = "numero_sesiones_dictadas")
    private Integer numeroSesionesDictadas;
}
