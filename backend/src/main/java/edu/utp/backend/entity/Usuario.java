package edu.utp.backend.entity;

import java.time.OffsetDateTime;

import org.hibernate.annotations.CreationTimestamp;

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
@Table(name = "usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer id;
    @Column(name = "email", length = 50, nullable = false, unique = true)
    private String email;
    @Column(name = "clave", length = 50, nullable = false)
    private String contraseña;
    @Column(name="rol")
    private String rol;
    @Column(name = "estado_cuenta", length = 100)
    private String estadoCuenta;
    @CreationTimestamp
    @Column(name = "fecha_registro", updatable = false)
    private OffsetDateTime fechaCreacion;
}
