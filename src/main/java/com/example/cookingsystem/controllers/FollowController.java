package com.example.cookingsystem.controllers;

import com.example.cookingsystem.dtos.FollowDTO;
import com.example.cookingsystem.dtos.FollowStatusDTO;
import com.example.cookingsystem.dtos.PagedFollowResponseDTO;
import com.example.cookingsystem.services.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/follows")
public class FollowController {

    private final FollowService followService;

    @Autowired
    public FollowController(FollowService followService) {
        this.followService = followService;
    }

    /**
     * Follow a user
     * @param followDTO Contains follower and following IDs
     * @return Response status
     */
    @PostMapping("/follow")
    public ResponseEntity<Void> followUser(@RequestBody FollowDTO followDTO) {
        boolean success = followService.followUser(followDTO.getFollowerId(), followDTO.getFollowingId());

        if (success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Unfollow a user
     * @param followDTO Contains follower and following IDs
     * @return Response status
     */
    @PostMapping("/unfollow")
    public ResponseEntity<Void> unfollowUser(@RequestBody FollowDTO followDTO) {
        boolean success = followService.unfollowUser(followDTO.getFollowerId(), followDTO.getFollowingId());

        if (success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Check follow status between two users
     * @param userId Current user ID
     * @param targetUserId Target user ID
     * @return FollowStatusDTO with follow status info
     */
    @GetMapping("/status")
    public ResponseEntity<FollowStatusDTO> checkFollowStatus(
            @RequestParam String userId,
            @RequestParam String targetUserId) {
        FollowStatusDTO followStatus = followService.checkFollowStatus(userId, targetUserId);
        return ResponseEntity.ok(followStatus);
    }

    /**
     * Get user's followers with pagination
     * @param userId User ID to get followers for
     * @param page Page number (0-based)
     * @param size Page size
     * @param currentUserId Current user ID to check follow status
     * @return Paginated response with followers
     */
    @GetMapping("/{userId}/followers")
    public ResponseEntity<PagedFollowResponseDTO> getFollowers(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam String currentUserId) {
        PagedFollowResponseDTO followers = followService.getFollowers(userId, page, size, currentUserId);
        return ResponseEntity.ok(followers);
    }

    /**
     * Get user's following with pagination
     * @param userId User ID to get following for
     * @param page Page number (0-based)
     * @param size Page size
     * @param currentUserId Current user ID to check follow status
     * @return Paginated response with following users
     */
    @GetMapping("/{userId}/following")
    public ResponseEntity<PagedFollowResponseDTO> getFollowing(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam String currentUserId) {
        PagedFollowResponseDTO following = followService.getFollowing(userId, page, size, currentUserId);
        return ResponseEntity.ok(following);
    }
}