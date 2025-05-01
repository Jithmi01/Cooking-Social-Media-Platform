package com.example.cookingsystem.repositories;

import com.example.cookingsystem.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmailAndDeleteStatusFalse(String email);
    List<User> findAllByDeleteStatusFalse();
    Optional<User> findByIdAndDeleteStatusFalse(String id);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
}