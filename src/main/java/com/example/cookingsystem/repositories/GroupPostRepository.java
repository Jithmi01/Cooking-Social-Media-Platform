package com.example.cookingsystem.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.cookingsystem.models.GroupPost;

@Repository
public interface GroupPostRepository extends MongoRepository<GroupPost, String> {

    // Find all active posts (not deleted)
    List<GroupPost> findByDeleteStatusFalseOrderByCreatedAtDesc();

    // Find active posts by group ID
    @Query("{'postedOn._id': ?0, 'deleteStatus': false}")
    List<GroupPost> findByPostedOnIdAndDeleteStatusFalseOrderByCreatedAtDesc(String groupId);

    // Find active posts by user ID
    @Query("{'postedBy._id': ?0, 'deleteStatus': false}")
    List<GroupPost> findByPostedByIdAndDeleteStatusFalseOrderByCreatedAtDesc(String userId);

    // Find a specific active post by ID
    GroupPost findByIdAndDeleteStatusFalse(String id);
}