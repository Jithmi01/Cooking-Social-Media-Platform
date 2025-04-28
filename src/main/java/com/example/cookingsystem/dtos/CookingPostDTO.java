package com.example.cookingsystem.dtos;



import java.util.Date;

public class CookingPostDTO {
    private String title;
    private String description;
    private Date createdAt;
    private int likeCount;
    private String createdBy;

    // Default constructor
    public CookingPostDTO() {
    }

    // Overloaded constructor
    public CookingPostDTO(String title, String description, Date createdAt, int likeCount, String createdBy) {
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.likeCount = likeCount;
        this.createdBy = createdBy;
    }

    // Getters and setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public int getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(int likeCount) {
        this.likeCount = likeCount;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
}
