package com.example.cookingsystem.services;

import com.example.cookingsystem.models.Comment;
import com.example.cookingsystem.models.CookingPost;
import com.example.cookingsystem.models.Notification;
import com.example.cookingsystem.models.User;
import com.example.cookingsystem.repositories.CommentRepository;
import com.example.cookingsystem.repositories.CookingPostRepository;
import com.example.cookingsystem.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final CookingPostRepository cookingPostRepository;

    private final NotificationService notificationService;

    @Autowired
    public CommentService(CommentRepository commentRepository,
                          UserRepository userRepository,
                          CookingPostRepository cookingPostRepository,NotificationService notifcationService) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.cookingPostRepository = cookingPostRepository;
        this.notificationService = notifcationService;
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
        Optional<CookingPost> postOptional = cookingPostRepository.findById(postId);

        if (userOptional.isPresent() && postOptional.isPresent()) {
            Comment comment = new Comment();
            comment.setComment(commentText);
            comment.setCommentedAt(new Date());
            comment.setCommentedBy(userOptional.get());
            comment.setCommentedOn(postOptional.get());
            comment.setDeleteStatus(false);

            Notification notification = new Notification();
            notification.setDeleteStatus(false);
            notification.setReceiver(comment.getCommentedOn().getCreatedBy());
            notification.setTitle("You have a new comment");
            notification.setSubtitle(comment.getCommentedBy().getName() + " commented to your post");
            notificationService.createNotification(notification,comment.getCommentedOn().getCreatedBy().getId());

            return commentRepository.save(comment);
        }
        return null;
    }

    // Update comment
    public Comment updateComment(String id, String newCommentText) {
        return commentRepository.findById(id).map(comment -> {
            comment.setComment(newCommentText);
            return commentRepository.save(comment);
        }).orElse(null);
    }

    // Delete comment (soft delete)
    public boolean deleteComment(String id) {
        return commentRepository.findById(id).map(comment -> {
            comment.setDeleteStatus(true);
            commentRepository.save(comment);
            return true;
        }).orElse(false);
    }
}