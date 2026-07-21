package com.pdfchat.pdfchatbot.security;

import com.pdfchat.pdfchatbot.entity.Role;
import com.pdfchat.pdfchatbot.entity.User;
import com.pdfchat.pdfchatbot.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationTrustResolver;
import org.springframework.security.authentication.AuthenticationTrustResolverImpl;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Value("${app.oauth2.redirect-uri}")
    private String redirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String fullName = oAuth2User.getAttribute("name");

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = User.builder()
                    .email(email)
                    .username(deriveUsername(email))
                    .fullName(fullName != null ? fullName : email)
                    // OAuth users never log in with a password, but the column is NOT NULL,
                    // so we store an unusable random hash — it can never match anything typed.
                    .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .role(Role.USER)
                    .isActive(true)
                    .build();
            return userRepository.save(newUser);
        });

        String jwt = jwtUtils.generateToken(user);

        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("token", jwt)
                .build().toUriString();

        response.sendRedirect(targetUrl);
    }

    private String deriveUsername(String email) {
        String base = email.substring(0, email.indexOf('@'));
        String candidate = base;
        int suffix = 1;
        while (userRepository.existsByUsername(candidate)) {
            candidate = base + suffix++;
        }
        return candidate;
    }
}