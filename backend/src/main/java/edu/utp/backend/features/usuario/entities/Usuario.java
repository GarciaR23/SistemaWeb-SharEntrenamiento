package edu.utp.backend.features.usuario.entities;

import java.time.ZonedDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import edu.utp.backend.features.usuario.enums.EstadoCuenta;
import edu.utp.backend.features.usuario.enums.Rol;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long idUsuario;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String clave;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(nullable = false, columnDefinition = "tipo_rol")
    private Rol rol;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "estado_cuenta", columnDefinition = "tipo_estado")
    private EstadoCuenta estadoCuenta = EstadoCuenta.pendiente_validacion;

    @Column(name = "fecha_registro", updatable = false)
    private ZonedDateTime fechaRegistro = ZonedDateTime.now();

    @Column(name = "ultimo_login")
    private ZonedDateTime ultimoLogin;
}
