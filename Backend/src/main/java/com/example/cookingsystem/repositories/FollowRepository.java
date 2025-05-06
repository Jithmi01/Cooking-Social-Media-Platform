package com.example.cookingsystem.repositories;

import com.example.cookingsystem.models.Follow;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends MongoRepository<Follow, String> {

    // Find a specific follow relationship
    Optional<Follow> findByFollowerIdAndFollowingId(String followerId, String followingId);

    // Delete a follow relationship
    void deleteByFollowerIdAndFollowingId(String followerId, String followingId);

    // Count followers for a user
    long countByFollowingId(String userId);

    // Count how many users a specific user is following
    long countByFollowerId(String userId);

    // Get all users following a specific user
    List<Follow> findByFollowingId(String userId);

    // Get all users that a specific user is following
    List<Follow> findByFollowerId(String userId);

    // Paginated version for large datasets
    Page<Follow> findByFollowingId(String userId, Pageable pageable);

    // Paginated version for large datasets
    Page<Follow> findByFollowerId(String userId, Pageable pageable);
}