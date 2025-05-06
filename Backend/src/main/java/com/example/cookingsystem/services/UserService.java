package com.example.cookingsystem.services;

import com.example.cookingsystem.models.User;
import com.example.cookingsystem.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAllByDeleteStatusFalse();
    }

    // Get user by ID
    public Optional<User> getUserById(String id) {
        return userRepository.findByIdAndDeleteStatusFalse(id);
    }

    // Create user
    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setDeleteStatus(false);
        return userRepository.save(user);
    }

    // Update user
    public User updateUser(String id, User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setName(userDetails.getName());
            user.setEmail(userDetails.getEmail());
            user.setBirthday(userDetails.getBirthday());
            if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
            }
            user.setGender(userDetails.getGender());
            user.setAge(userDetails.getAge());
            user.setPublic(userDetails.isPublic());
            return userRepository.save(user);
        }).orElse(null);
    }

    // Delete user (soft delete)
    public boolean deleteUser(String id) {
        return userRepository.findById(id).map(user -> {
            user.setDeleteStatus(true);
            userRepository.save(user);
            return true;
        }).orElse(false);
    }

    // Login by email and password
    public User login(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmailAndDeleteStatusFalse(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user;
            }
        }
        return null;
    }
}