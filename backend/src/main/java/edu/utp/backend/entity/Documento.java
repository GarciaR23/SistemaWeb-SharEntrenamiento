package edu.utp.backend.entity;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
    private Integer idDocumento;
    
    @ManyToOne
    @JoinColumn(name = "id_instructor", nullable = false)
    private Instructor instructor;
    @Column(name = "nombre_documento", nullable = false, length = 100)
    private String nombreDocumento;
    @Column(name = "url_archivo", nullable = false)
    private String urlArchivo;
    @Column(name = "estado_aprobacion")
    private String estadoAprobacion;
    @Column(name = "fecha_subida")
    private OffsetDateTime fechaSubida;
}