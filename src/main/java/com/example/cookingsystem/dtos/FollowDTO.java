package com.example.cookingsystem.dtos;

import java.time.LocalDateTime;
import java.util.List;

// DTO for follow/unfollow action
public class FollowDTO {
    private String followerId;
    private String followingId;

    public FollowDTO() {
    }

    public FollowDTO(String followerId, String followingId) {
        this.followerId = followerId;
        this.followingId = followingId;
    }

    public String getFollowerId() {
        return followerId;
    }

    public void setFollowerId(String followerId) {
        this.followerId = followerId;
    }

    public String getFollowingId() {
        return followingId;
    }

    public void setFollowingId(String followingId) {
        this.followingId = followingId;
    }
}
