package com.example.cookingsystem.controllers;


import com.example.cookingsystem.dtos.LoginDTO;
import com.example.cookingsystem.dtos.OAuth2UserDto;
import com.example.cookingsystem.models.User;
import com.example.cookingsystem.repositories.UserRepository;
import com.example.cookingsystem.security.JwtAuthResponse;
import com.example.cookingsystem.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    UserRepository userRepository;

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<JwtAuthResponse> authenticateUser(@RequestBody LoginDTO loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getEmail(),
                        loginDto.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = tokenProvider.generateToken(authentication);

        Optional<User> user= userRepository.findByEmail(loginDto.getEmail());

        if(user.isEmpty()) return ResponseEntity.ok(new JwtAuthResponse(token, ""));


        return ResponseEntity.ok(new JwtAuthResponse(token, user.get().getId()));
    }

    @GetMapping("/oauth2/user")
    public ResponseEntity<?> getOAuth2User(Principal principal) {
        if (principal == null) {
            return ResponseEntity.ok(null);
        }

        OAuth2User oAuth2User = (OAuth2User) ((Authentication) principal).getPrincipal();
        Map<String, Object> attributes = oAuth2User.getAttributes();

        // Extract user info from OAuth2 attributes
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");

        // Check if user exists, if not create new user
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setUsername(email);
                    newUser.setName(name);
                    return userRepository.save(newUser);
                });

        OAuth2UserDto userDto = new OAuth2UserDto();
        userDto.setId(user.getId());
        userDto.setName(user.getName());
        userDto.setEmail(user.getEmail());

        return ResponseEntity.ok(userDto);
    }

}