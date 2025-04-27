package com.example.cookingsystem.dtos;

public class UserFollowInfoDTO {
    private String id;
    private String username;
    private String name;
    private int followersCount;
    private int followingCount;
    private boolean isFollowing;

    public UserFollowInfoDTO() {
    }

    public UserFollowInfoDTO(String id, String username, String name, int followersCount, int followingCount, boolean isFollowing) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.followersCount = followersCount;
        this.followingCount = followingCount;
        this.isFollowing = isFollowing;
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getFollowersCount() {
        return followersCount;
    }

    public void setFollowersCount(int followersCount) {
        this.followersCount = followersCount;
    }

    public int getFollowingCount() {
        return followingCount;
    }

    public void setFollowingCount(int followingCount) {
        this.followingCount = followingCount;
    }

    public boolean isFollowing() {
        return isFollowing;
    }

    public void setFollowing(boolean following) {
        isFollowing = following;
    }
}
