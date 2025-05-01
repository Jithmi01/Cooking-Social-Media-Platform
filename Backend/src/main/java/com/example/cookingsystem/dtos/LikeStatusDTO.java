package com.example.cookingsystem.dtos;

public class LikeStatusDTO {
    public boolean isLiked() {
        return isLiked;
    }

    public void setLiked(boolean liked) {
        isLiked = liked;
    }

    public String getLikeId() {
        return likeId;
    }

    public void setLikeId(String likeId) {
        this.likeId = likeId;
    }

    private  boolean isLiked;
    private  String likeId;
}
