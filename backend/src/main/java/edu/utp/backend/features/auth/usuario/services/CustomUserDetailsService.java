package edu.utp.backend.features.auth.usuario.services;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import edu.utp.backend.features.auth.usuario.entities.Usuario;
import edu.utp.backend.features.auth.usuario.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    
    private final UsuarioRepository userRepo;

    @Override
    public UserDetails loadUserByUsername(String email) 
            throws UsernameNotFoundException {
        Usuario user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: "));
        return User.builder()
                .username(user.getEmail())
                .password(user.getClave())
                .roles(user.getRol().name())
                .build();
    }

}
