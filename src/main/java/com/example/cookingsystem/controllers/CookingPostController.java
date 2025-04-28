package com.example.cookingsystem.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.cookingsystem.dtos.CookingPostDTO;
import com.example.cookingsystem.models.CookingPost;
import com.example.cookingsystem.models.User;
import com.example.cookingsystem.services.CookingPostService;
import com.example.cookingsystem.services.UserService;

@RestController
@RequestMapping("/api/posts")
public class CookingPostController {

    private final CookingPostService cookingPostService;
    private  final UserService userService;

    @Autowired
    public CookingPostController(CookingPostService cookingPostService,UserService userService) {
        this.cookingPostService = cookingPostService;
        this.userService =userService;
    }
    // Get all posts
    @GetMapping
    public ResponseEntity<List<CookingPost>> getAllPosts() {
        List<CookingPost> posts = cookingPostService.getAllPosts();
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    // Get posts by current user
    @GetMapping("/my-posts/{userId}")
    public ResponseEntity<List<CookingPost>> getMyPosts(@PathVariable String userId) {

        List<CookingPost> posts = cookingPostService.getPostsByUser(userId);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    // Get post by ID
    @GetMapping("/{id}")
    public ResponseEntity<CookingPost> getPostById(@PathVariable String id) {
        Optional<CookingPost> post = cookingPostService.getPostById(id);
        return post.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }


   
    // Create new post
    @PostMapping
    public ResponseEntity<CookingPost> createPost(@RequestBody CookingPostDTO postDto
                                                 ) {
        String userId = postDto.getCreatedBy();
        Optional<User> user = userService.getUserById(userId);
        if(user.isPresent()){
            CookingPost post = new CookingPost();
            post.setCreatedBy(user.get());
            post.setDescription(postDto.getDescription());
            post.setTitle(postDto.getTitle());
            post.setCreatedAt(postDto.getCreatedAt());
            post.setLikeCount(postDto.getLikeCount());
            post.setDeleteStatus(false);
            CookingPost createdPost = cookingPostService.createPost(post, userId);
            if (createdPost != null) {
                return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
            }
        }

        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

}