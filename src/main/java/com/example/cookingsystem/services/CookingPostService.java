package com.example.cookingsystem.services;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.cookingsystem.models.CookingPost;
import com.example.cookingsystem.models.User;
import com.example.cookingsystem.repositories.CookingPostRepository;
import com.example.cookingsystem.repositories.UserRepository;

@Service
public class CookingPostService {

    private final CookingPostRepository cookingPostRepository;
    private final UserRepository userRepository;

    @Autowired
    public CookingPostService(CookingPostRepository cookingPostRepository, UserRepository userRepository) {
        this.cookingPostRepository = cookingPostRepository;
        this.userRepository = userRepository;
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

    
}