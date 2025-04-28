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


}