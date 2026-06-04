package edu.utp.backend.features.auth.services;

import edu.utp.backend.features.auth.dtos.LoginRequest;
import edu.utp.backend.features.auth.dtos.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
}