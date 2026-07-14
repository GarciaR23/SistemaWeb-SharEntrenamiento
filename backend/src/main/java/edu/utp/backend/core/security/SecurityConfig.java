package edu.utp.backend.core.security;

import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import edu.utp.backend.core.security.jwt.JwtAccessDeniedHandler;
import edu.utp.backend.core.security.jwt.JwtAuthEntryPoint;
import edu.utp.backend.core.security.jwt.JwtAuthenticationFilter;
import edu.utp.backend.features.usuario.services.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthEntryPoint jwtAuthEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(jwtAuthEntryPoint)
                        .accessDeniedHandler(jwtAccessDeniedHandler))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/public/status").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/cloudinary/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/documentos/instructor/*/observados").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/documentos/*/corregir").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/documentos/instructor/*/finalizar-correccion")
                        .permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/admin/revisiones/instructor/*/documentos-rechazados")
                        .permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/instructores", "/api/tutores", "/api/pacientes",
                                "/api/documentos")
                        .permitAll()

                        // ADMIN
                        .requestMatchers("/api/admin/**").hasAuthority("admin")

                        // ANALÍTICA / CONTADORES (admin e instructor)
                        .requestMatchers(HttpMethod.GET, "/api/instructores/analitica/**")
                        .hasAnyAuthority("admin", "instructor")

                        .requestMatchers(HttpMethod.PATCH, "/api/reservas/detalle/*/cancelar")
                        .hasAnyAuthority("tutor", "admin")

                        // BÚSQUEDA DE INSTRUCTORES
                        .requestMatchers(HttpMethod.GET, "/api/instructores/busqueda")
                        .hasAnyAuthority("tutor", "admin")

                        // PERFIL DE INSTRUCTOR
                        .requestMatchers(HttpMethod.GET, "/api/instructores/*/perfil/**")
                        .hasAnyAuthority("tutor", "admin")

                        // LISTAR INSTRUCTORES
                        .requestMatchers(HttpMethod.GET, "/api/instructores")
                        .hasAnyAuthority("tutor", "admin", "instructor")

                        // INSTRUCTORES (resto)
                        .requestMatchers("/api/instructores/**")
                        .hasAnyAuthority("instructor", "admin")

                        // TUTORES
                        .requestMatchers("/api/tutores/**")
                        .hasAnyAuthority("tutor", "admin")

                        // SEDES
                        .requestMatchers("/api/sedes/**")
                        .hasAnyAuthority("instructor", "admin")

                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService(CustomUserDetailsService customUserDetailsService) {
        return customUserDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:*",
                "http://127.0.0.7:*",
                "http://127.0.0.1:5501",
                "http://127.0.0.1:5502"));

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}