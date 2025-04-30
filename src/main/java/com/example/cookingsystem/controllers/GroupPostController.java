package com.example.cookingsystem.controllers;

import com.example.cookingsystem.dtos.GroupPostDTO;
import com.example.cookingsystem.services.GroupPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/group-posts")
public class GroupPostController {

    private final GroupPostService groupPostService;

    @Autowired
    public GroupPostController(GroupPostService groupPostService) {
        this.groupPostService = groupPostService;
    }

    /**
     * Get all group posts
     */
    @GetMapping
    public ResponseEntity<List<GroupPostDTO.GroupPostResponse>> getAllGroupPosts() {
        List<GroupPostDTO.GroupPostResponse> posts = groupPostService.getAllGroupPosts();
        return ResponseEntity.ok(posts);
    }

    /**
     * Get a specific group post by ID
     */
    @GetMapping("/{postId}")
    public ResponseEntity<GroupPostDTO.GroupPostResponse> getGroupPostById(@PathVariable String postId) {
        GroupPostDTO.GroupPostResponse post = groupPostService.getGroupPostById(postId);
        return ResponseEntity.ok(post);
    }

    /**
     * Get posts by group ID
     */
    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<GroupPostDTO.GroupPostResponse>> getPostsByGroupId(@PathVariable String groupId) {
        List<GroupPostDTO.GroupPostResponse> posts = groupPostService.getPostsByGroupId(groupId);
        return ResponseEntity.ok(posts);
    }

    /**
     * Get posts by user ID
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<GroupPostDTO.GroupPostResponse>> getPostsByUserId(@PathVariable String userId) {
        List<GroupPostDTO.GroupPostResponse> posts = groupPostService.getPostsByUserId(userId);
        return ResponseEntity.ok(posts);
    }

    /**
     * Create a new group post
     */
    @PostMapping
    public ResponseEntity<GroupPostDTO.GroupPostResponse> createGroupPost(
            @RequestBody GroupPostDTO.GroupPostRequest postRequest,
            @RequestHeader("User-ID") String userId) {
        GroupPostDTO.GroupPostResponse createdPost = groupPostService.createGroupPost(postRequest, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
    }

    /**
     * Update an existing group post
     */
    @PutMapping("/{postId}")
    public ResponseEntity<GroupPostDTO.GroupPostResponse> updateGroupPost(
            @PathVariable String postId,
            @RequestBody GroupPostDTO.GroupPostRequest postRequest,
            @RequestHeader("User-ID") String userId) {
        GroupPostDTO.GroupPostResponse updatedPost = groupPostService.updateGroupPost(postId, postRequest, userId);
        return ResponseEntity.ok(updatedPost);
    }

    /**
     * Delete a group post (soft delete)
     */
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deleteGroupPost(
            @PathVariable String postId,
            @RequestHeader("User-ID") String userId) {
        groupPostService.deleteGroupPost(postId, userId);
        return ResponseEntity.noContent().build();
    }
}