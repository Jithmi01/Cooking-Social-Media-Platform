package com.example.cookingsystem.repositories;

import com.example.cookingsystem.models.Like;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends MongoRepository<Like, String> {
    List<Like> findByLikedPostIdAndDeleteStatusFalse(String postId);
    Optional<Like> findByLikedByIdAndLikedPostIdAndDeleteStatusFalse(String userId, String postId);
    List<Like> findAllByDeleteStatusFalse();
    Optional<Like> findByIdAndDeleteStatusFalse(String id);
    List<Like> findByLikedByIdAndDeleteStatusFalse(String userId);
}