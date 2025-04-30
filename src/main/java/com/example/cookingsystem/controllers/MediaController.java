package com.example.cookingsystem.controllers;

import com.example.cookingsystem.dtos.MediaDTO;
import com.example.cookingsystem.models.CookingPost;
import com.example.cookingsystem.models.Media;
import com.example.cookingsystem.services.CookingPostService;
import com.example.cookingsystem.services.MediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

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

    // Get all media
    @GetMapping
    public ResponseEntity<List<Media>> getAllMedia() {
        List<Media> mediaList = mediaService.getAllMedia();
        return new ResponseEntity<>(mediaList, HttpStatus.OK);
    }

    // Get media by ID
    @GetMapping("/{id}")
    public ResponseEntity<Media> getMediaById(@PathVariable String id) {
        Optional<Media> media = mediaService.getMediaById(id);
        return media.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Get media by post ID
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Media>> getMediaByPostId(@PathVariable String postId) {
        List<Media> mediaList = mediaService.getMediaByPostId(postId);
        return new ResponseEntity<>(mediaList, HttpStatus.OK);
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

    // Create media with file upload
    @PostMapping(value = "/upload/post/{postId}", consumes = "multipart/form-data")
    public ResponseEntity<Media> uploadMedia(
            @RequestParam("type") String type,
            @RequestParam("file") MultipartFile file,
            @PathVariable String postId) {
        try {
            Media media = mediaService.createMediaWithFile(type, file, postId);
            if (media != null) {
                return new ResponseEntity<>(media, HttpStatus.CREATED);
            }
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update media
    @PutMapping("/{id}")
    public ResponseEntity<Media> updateMedia(@PathVariable String id,
                                             @RequestBody Media mediaDetails) {
        Media updatedMedia = mediaService.updateMedia(id, mediaDetails);
        if (updatedMedia != null) {
            return new ResponseEntity<>(updatedMedia, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Delete media
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedia(@PathVariable String id) {
        if (mediaService.deleteMedia(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}