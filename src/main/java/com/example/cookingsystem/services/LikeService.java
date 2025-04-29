package com.example.cookingsystem.services;

import com.example.cookingsystem.models.Like;
import com.example.cookingsystem.models.User;
import com.example.cookingsystem.repositories.LikeRepository;
import com.example.cookingsystem.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class LikeService {

    private final LikeRepository likeRepository;
    private final UserRepository userRepository;



    @Autowired
    public LikeService(LikeRepository likeRepository,
                       UserRepository userRepository,
                       {
        this.likeRepository = likeRepository;
        this.userRepository = userRepository;

    }

    // Get all likes
    public List<Like> getAllLikes() {
        return likeRepository.findAllByDeleteStatusFalse();
    }

    // Get like by ID
    public Optional<Like> getLikeById(String id) {
        return likeRepository.findByIdAndDeleteStatusFalse(id);
    }

    // Get likes by post ID
    public List<Like> getLikesByPostId(String postId) {
        return likeRepository.findByLikedPostIdAndDeleteStatusFalse(postId);
    }

    // Get likes by user ID
    public List<Like> getLikesByUserId(String userId) {
        List<Like> likes = likeRepository.findByLikedByIdAndDeleteStatusFalse(userId);
        Collections.reverse(likes);
        return likes;
    }

    // Check if user liked a post
    public Optional<Like> hasUserLikedPost(String userId, String postId) {
        return likeRepository.findByLikedByIdAndLikedPostIdAndDeleteStatusFalse(userId, postId);
    }

    // Create like
    public Like createLike(String postId, String userId) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isPresent() && postOptional.isPresent()) {
            // Check if like already exists
            if (hasUserLikedPost(userId, postId).isPresent() ) {
                return null;
            }

            Like like = new Like();
            like.setLikedAt(new Date());
            like.setLikedBy(userOptional.get());

            

            return likeRepository.save(like);
        }
        return null;
    }

        // Unlike (soft delete)
        public boolean unlike(String userId, String postId) {
            Optional<Like> likeOptional = likeRepository.findByLikedByIdAndLikedPostIdAndDeleteStatusFalse(userId, postId);
            if (likeOptional.isPresent()) {
                Like like = likeOptional.get();
                like.setDeleteStatus(true);
                likeRepository.save(like);
    

            }
            return false;
        }

        // Delete like (admin function)
        public boolean deleteLike(String id) {
            return likeRepository.findById(id).map(like -> {
                like.setDeleteStatus(true);
                likeRepository.save(like);
    
                
        }


}