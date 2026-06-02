package edu.utp.backend.core.security.jwt.services;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import edu.utp.backend.core.security.jwt.JwtConfig;
import edu.utp.backend.features.auth.usuario.entities.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

@Service
@RequiredArgsConstructor
public class JwtService {
    private final JwtConfig jwtConfig;
    private final SecretKey secretKey;

    public String GenerarToken(Usuario usuario) {
        return Jwts.builder()
            .setSubject(usuario.getEmail())
            .claim("roles", usuario.getRol().name())
            .setIssuedAt(new Date())
            .setExpiration(new Date(
                System.currentTimeMillis() + jwtConfig.getTokenExpirationInMillis()
            ))
            .signWith(secretKey)
            .compact();
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String email = extractEmail(token);
        return email.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(secretKey)
            .build()
            .parseClaimsJws(token)
            .getBody();
    }
}
