package com.pdfchat.pdfchatbot.service;

import com.pdfchat.pdfchatbot.dto.auth.AuthResponse;
import com.pdfchat.pdfchatbot.dto.auth.LoginRequest;
import com.pdfchat.pdfchatbot.dto.auth.RegisterRequest;
import com.pdfchat.pdfchatbot.dto.auth.UserResponse;
import com.pdfchat.pdfchatbot.entity.Role;
import com.pdfchat.pdfchatbot.entity.User;
import com.pdfchat.pdfchatbot.exception.ApiException.BadRequestException;
import com.pdfchat.pdfchatbot.exception.ApiException.ConflictException;
import com.pdfchat.pdfchatbot.exception.ApiException.ResourceNotFoundException;
import com.pdfchat.pdfchatbot.repository.UserRepository;
import com.pdfchat.pdfchatbot.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("An account with this email already exists");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ConflictException("This username is already taken");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .isActive(true)
                .build();

        User saved = userRepository.save(user);
        String token = jwtUtils.generateToken(saved);
        return AuthResponse.of(token, UserResponse.fromEntity(saved));
    }

    public AuthResponse login(LoginRequest request) {
        String identifier = request.resolveIdentifier();
        if (identifier == null) {
            throw new BadRequestException("Email or username is required");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(identifier, request.getPassword())
        );

        User user = userRepository.findByEmail(identifier)
                .or(() -> userRepository.findByUsername(identifier))
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String token = jwtUtils.generateToken(user);
        return AuthResponse.of(token, UserResponse.fromEntity(user));
    }

    public UserResponse me(String usernameFromToken) {
        User user = userRepository.findByEmail(usernameFromToken)
                .or(() -> userRepository.findByUsername(usernameFromToken))
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserResponse.fromEntity(user);
    }
}
