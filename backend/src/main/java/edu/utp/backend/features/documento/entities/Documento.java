package edu.utp.backend.features.documento.entities;

import java.time.OffsetDateTime;

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
@Table(name = "documento")
public class Documento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_documento")
    private Long idDocumento;

    @Column(name = "id_instructor", nullable = false)
    private Long idInstructor;

    @Column(name = "nombre_documento", nullable = false)
    private String nombreDocumento;

    @Column(name = "url_archivo", nullable = false)
    private String urlArchivo;

    @ColumnTransformer(write = "?::tipo_aprobacion")
    @Column(name = "estado_aprobacion", columnDefinition = "tipo_aprobacion")
    private String estadoAprobacion = "pendiente";

    @Column(name = "fecha_subida", insertable = false, updatable = false)
    private OffsetDateTime fechaSubida;
}