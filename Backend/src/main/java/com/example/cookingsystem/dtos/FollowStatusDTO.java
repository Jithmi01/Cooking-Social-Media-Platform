package com.example.cookingsystem.dtos;

public class FollowStatusDTO {
    private boolean isFollowing;
    private boolean isFollower;

    public FollowStatusDTO() {
    }

    public FollowStatusDTO(boolean isFollowing, boolean isFollower) {
        this.isFollowing = isFollowing;
        this.isFollower = isFollower;
    }

    public boolean isFollowing() {
        return isFollowing;
    }

    public void setFollowing(boolean following) {
        isFollowing = following;
    }

    public boolean isFollower() {
        return isFollower;
    }

    public void setFollower(boolean follower) {
        isFollower = follower;
    }
}