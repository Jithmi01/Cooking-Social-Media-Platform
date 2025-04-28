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
    private final CommentRepository commentRepository;


    @Autowired
    public CommentService(CommentRepository commentRepository,
                          UserRepository userRepository
                          ) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        
    }

     // Get all comments
     public List<Comment> getAllComments() {
        return commentRepository.findAllByDeleteStatusFalse();
    }

    // Get comment by ID
    public Optional<Comment> getCommentById(String id) {
        return commentRepository.findByIdAndDeleteStatusFalse(id);
    }

    // Get comments by post ID
    public List<Comment> getCommentsByPostId(String postId) {
        return commentRepository.findByCommentedOnIdAndDeleteStatusFalse(postId);
    }

    // Get comments by user ID
    public List<Comment> getCommentsByUserId(String userId) {
        return commentRepository.findByCommentedByIdAndDeleteStatusFalse(userId);
    }  

    // Create comment
    public Comment createComment(String commentText, String postId, String userId) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isPresent() ) {
            Comment comment = new Comment();
            comment.setComment(commentText);
            comment.setCommentedAt(new Date());
            comment.setCommentedBy(userOptional.get());

           
            return commentRepository.save(comment);
        }
        return null;
    }

   
}