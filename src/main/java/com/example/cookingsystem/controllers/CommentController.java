package com.example.cookingsystem.controllers;

import com.example.cookingsystem.dtos.CommentDto;
import com.example.cookingsystem.models.Comment;
import com.example.cookingsystem.models.CookingPost;
import com.example.cookingsystem.models.User;
import com.example.cookingsystem.services.CommentService;
import com.example.cookingsystem.services.CookingPostService;
import com.example.cookingsystem.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;
    private final UserService userService;

    @Autowired
    public CommentController(CommentService commentService,UserService userService) {
        this.commentService = commentService;
        this.userService = userService;
    }

   




    // Create comment
    @PostMapping("/post/{postId}")
    public ResponseEntity<Comment> createComment(
            @RequestBody CommentDto commentDto,
            @PathVariable String postId
            ) {
        Optional<User> user = userService.getUserById(commentDto.getCommentedBy());
        Optional<CookingPost> post = postService.getPostById(postId);
        if(user.isPresent() && post.isPresent()){

            Comment createdComment = commentService.createComment(commentDto.getComment(), postId, user.get().getId());

            if (createdComment != null) {
                return new ResponseEntity<>(createdComment, HttpStatus.CREATED);
            }
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    
}