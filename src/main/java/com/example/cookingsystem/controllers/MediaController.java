package com.example.cookingsystem.controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.cookingsystem.dtos.MediaDTO;
import com.example.cookingsystem.models.CookingPost;
import com.example.cookingsystem.models.Media;
import com.example.cookingsystem.services.CookingPostService;
import com.example.cookingsystem.services.MediaService;

@RestController
@RequestMapping("/api/media")
public class MediaController {

    private final MediaService mediaService;
    private final CookingPostService postService;

    @Autowired
    public MediaController(MediaService mediaService,CookingPostService postService) {
        this.mediaService = mediaService;
        this.postService =postService;
    }


    // Create media (basic)
    @PostMapping("/post/{postId}")
    public ResponseEntity<Media> createMedia(@RequestBody MediaDTO mediaDTO,
                                             @PathVariable String postId) {
        Optional<CookingPost> post = postService.getPostById(postId);
        if(post.isPresent()){
            Media media = new Media();
            media.setType(mediaDTO.getType());
            media.setUrl(mediaDTO.getUrl());
            media.setDeleteStatus(false);
            media.setRelatedPost(post.get());
            System.out.println(media.getRelatedPost());
            Media createdMedia = mediaService.createMedia(media, postId);

            if (createdMedia != null) {
                return new ResponseEntity<>(createdMedia, HttpStatus.CREATED);
            }
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

  

   
}