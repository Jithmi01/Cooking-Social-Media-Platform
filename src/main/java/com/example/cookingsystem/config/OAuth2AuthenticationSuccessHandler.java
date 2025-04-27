package com.example.cookingsystem.config;

import com.example.cookingsystem.models.User;
import com.example.cookingsystem.repositories.UserRepository;
import com.example.cookingsystem.security.JwtTokenProvider;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider tokenProvider;

    private final UserRepository userRepository;
    @Autowired
    public OAuth2AuthenticationSuccessHandler(JwtTokenProvider tokenProvider,
                                              UserRepository userRepository) {
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        // Find or create user in your database
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setName(oAuth2User.getAttribute("name"));
                    newUser.setEmail(email);
                    return userRepository.save(newUser);
                });

        // Generate JWT token
        String token = tokenProvider.generateToken(authentication);
        System.out.println("Token value: " + token);
        System.out.println("User ID value: " + user.getId());
        // Build redirect URL with token and user ID
        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:5173/login/oauth2/code/google")
                .queryParam("token", token)
                .queryParam("userId", user.getId())
                .toUriString();
        System.out.println("Redirecting to: " + targetUrl);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}