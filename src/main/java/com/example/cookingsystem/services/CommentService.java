package com.example.cookingsystem.services;

import com.example.cookingsystem.models.Comment;
import com.example.cookingsystem.models.User;
import com.example.cookingsystem.repositories.CommentRepository;
import com.example.cookingsystem.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    private final UserRepository userRepository;


    @Autowired
    public CommentService(
                          UserRepository userRepository)
                           {
        this.userRepository = userRepository;
       
    }

   

    // Create comment
    public Comment createComment(String commentText, String postId, String userId) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isPresent() ) {
            Comment comment = new Comment();
            comment.setComment(commentText);
            comment.setCommentedAt(new Date());
            comment.setCommentedBy(userOptional.get());
            comment.setDeleteStatus(false);

           
            return commentRepository.save(comment);
        }
        return null;
    }

   
}