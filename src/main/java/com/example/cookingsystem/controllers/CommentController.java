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
    private final CookingPostService postService;
    private final UserService userService;

    @Autowired
    public CommentController(CommentService commentService,CookingPostService postService,UserService userService) {
        this.commentService = commentService;
        this.userService = userService;
        this.postService = postService;
    }

    // Get all comments
    @GetMapping
    public ResponseEntity<List<Comment>> getAllComments() {
        List<Comment> comments = commentService.getAllComments();
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    // Get comment by ID
    @GetMapping("/{id}")
    public ResponseEntity<Comment> getCommentById(@PathVariable String id) {
        Optional<Comment> comment = commentService.getCommentById(id);
        return comment.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Get comments by post ID
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comment>> getCommentsByPostId(@PathVariable String postId) {
        List<Comment> comments = commentService.getCommentsByPostId(postId);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    // Get comments by current user
    @GetMapping("/my-comments")
    public ResponseEntity<List<Comment>> getMyComments(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        List<Comment> comments = commentService.getCommentsByUserId(userId);
        return new ResponseEntity<>(comments, HttpStatus.OK);
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

    // Update comment
    @PutMapping("/{id}")
    public ResponseEntity<Comment> updateComment(
            @PathVariable String id,
            @RequestBody String newCommentText) {

        Comment updatedComment = commentService.updateComment(id, newCommentText);

        if (updatedComment != null) {
            return new ResponseEntity<>(updatedComment, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Delete comment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable String id) {
        if (commentService.deleteComment(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}