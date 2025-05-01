package com.example.cookingsystem.services;

import com.example.cookingsystem.models.CookingPost;
import com.example.cookingsystem.models.User;
import com.example.cookingsystem.repositories.CookingPostRepository;
import com.example.cookingsystem.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CookingPostService {

    private final CookingPostRepository cookingPostRepository;
    private final UserRepository userRepository;

    @Autowired
    public CookingPostService(CookingPostRepository cookingPostRepository, UserRepository userRepository) {
        this.cookingPostRepository = cookingPostRepository;
        this.userRepository = userRepository;
    }

    // Get all posts
    public List<CookingPost> getAllPosts() {
        return cookingPostRepository.findAllByDeleteStatusFalse();
    }

    // Get posts by user
    public List<CookingPost> getPostsByUser(String userId) {
        return cookingPostRepository.findByCreatedByIdAndDeleteStatusFalse(userId);
    }

    // Get post by ID
    public Optional<CookingPost> getPostById(String id) {
        return cookingPostRepository.findByIdAndDeleteStatusFalse(id);
    }

    // Create post
    public CookingPost createPost(CookingPost post, String userId) {
        try{
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isPresent()) {
                post.setCreatedBy(userOptional.get());
                post.setCreatedAt(new Date());
                post.setDeleteStatus(false);
                post.setLikeCount(0);
                return cookingPostRepository.save(post);
            }

        }catch (Exception e){
            System.out.println(e);
        }
        return null;
    }

    // Update post
    public CookingPost updatePost(String id, CookingPost postDetails) {
        return cookingPostRepository.findById(id).map(post -> {
            post.setTitle(postDetails.getTitle());
            post.setDescription(postDetails.getDescription());
            return cookingPostRepository.save(post);
        }).orElse(null);
    }

    // Delete post (soft delete)
    public boolean deletePost(String id) {
        return cookingPostRepository.findById(id).map(post -> {
            post.setDeleteStatus(true);
            cookingPostRepository.save(post);
            return true;
        }).orElse(false);
    }

    // Increment like count
    public boolean incrementLikeCount(String postId) {
        return cookingPostRepository.findById(postId).map(post -> {
            post.setLikeCount(post.getLikeCount() + 1);
            cookingPostRepository.save(post);
            return true;
        }).orElse(false);
    }

    // Decrement like count
    public boolean decrementLikeCount(String postId) {
        return cookingPostRepository.findById(postId).map(post -> {
            if (post.getLikeCount() > 0) {
                post.setLikeCount(post.getLikeCount() - 1);
            }
            cookingPostRepository.save(post);
            return true;
        }).orElse(false);
    }
}