package edu.utp.backend.features.admin.revision.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnTransformer;

import edu.utp.backend.features.admin.revision.enums.TipoAprobacion;

import java.time.ZonedDateTime;

@Entity
@Table(name = "revision_documento", schema = "public")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RevisionDocumento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_revision")
    private Integer idRevision;

    @Column(name = "id_documento", nullable = false)
    private Integer idDocumento;

    @Column(name = "id_usuario_admin", nullable = false)
    private Integer idUsuarioAdmin;

    @Column(name = "comentario_admin", columnDefinition = "text")
    private String comentarioAdmin;

    @Enumerated(EnumType.STRING)
    @ColumnTransformer(write = "?::tipo_aprobacion") 
    @Column(name = "resultado_revision", nullable = false, columnDefinition = "tipo_aprobacion")
    private TipoAprobacion resultadoRevision;

    @Column(name = "fecha_respuesta", insertable = false, updatable = false)
    private ZonedDateTime fechaRespuesta;
}