package com.example.cookingsystem.controllers;

import com.example.cookingsystem.dtos.LikeDTO;
import com.example.cookingsystem.dtos.LikeStatusDTO;
import com.example.cookingsystem.models.Like;
import com.example.cookingsystem.services.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    private final LikeService likeService;

    @Autowired
    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    // Get all likes
    @GetMapping
    public ResponseEntity<List<Like>> getAllLikes() {
        List<Like> likes = likeService.getAllLikes();
        return new ResponseEntity<>(likes, HttpStatus.OK);
    }

    // Get like by ID
    @GetMapping("/{id}")
    public ResponseEntity<Like> getLikeById(@PathVariable String id) {
        Optional<Like> like = likeService.getLikeById(id);
        return like.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Get likes by post ID
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Like>> getLikesByPostId(@PathVariable String postId) {
        List<Like> likes = likeService.getLikesByPostId(postId);
        return new ResponseEntity<>(likes, HttpStatus.OK);
    }

    // Get likes by current user
    @GetMapping("/my-likes")
    public ResponseEntity<List<Like>> getMyLikes(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        List<Like> likes = likeService.getLikesByUserId(userId);
        return new ResponseEntity<>(likes, HttpStatus.OK);
    }

    // Check if current user liked a post
    @GetMapping("/post/{postId}/{userId}/status")
    public ResponseEntity<LikeStatusDTO> getLikeStatus(@PathVariable String postId,
                                                 @PathVariable String userId) {

        Optional<Like> like = likeService.hasUserLikedPost(userId, postId);
        LikeStatusDTO likeStatusDTO = new LikeStatusDTO();
        if(like.isPresent()){
            likeStatusDTO.setLiked(true);
            likeStatusDTO.setLikeId(like.get().getId());
        }
        return new ResponseEntity<>(likeStatusDTO, HttpStatus.OK);
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

    // Unlike a post
    @DeleteMapping("/post/{postId}")
    public ResponseEntity<Void> unlikePost(@PathVariable String postId,
                                           @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        if (likeService.unlike(userId, postId)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Delete like (admin function)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLike(@PathVariable String id) {
        if (likeService.deleteLike(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}