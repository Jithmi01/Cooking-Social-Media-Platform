package com.example.cookingsystem.controllers;

import com.example.cookingsystem.dtos.LikeDTO;
import com.example.cookingsystem.models.Like;
import com.example.cookingsystem.services.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/likes")
public class LikeController {

    private final LikeService likeService;

    @Autowired
    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }


    // Like a post
    @PostMapping("/post/{postId}")
    public ResponseEntity<Like> likePost(@RequestBody LikeDTO liekDTO
                                         ) {
        String userId = liekDTO.getUserId();
        Like like = likeService.createLike(liekDTO.getPostId(), userId);

        if (like != null) {
            return new ResponseEntity<>(like, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }



}