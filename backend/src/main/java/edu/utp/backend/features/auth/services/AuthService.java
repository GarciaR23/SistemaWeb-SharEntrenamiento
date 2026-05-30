package edu.utp.backend.features.auth.services;

import edu.utp.backend.features.auth.dtos.LoginRequest;
import edu.utp.backend.features.auth.dtos.LoginResponse;
import edu.utp.backend.features.auth.dtos.RegisterRequest;

public interface AuthService {
    LoginResponse login(LoginRequest request);

    LoginResponse register(RegisterRequest request);
}