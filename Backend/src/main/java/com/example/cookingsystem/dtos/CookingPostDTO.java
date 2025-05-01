package com.example.cookingsystem.dtos;



import java.util.Date;
import java.util.List;

public class CookingPostDTO {
    private String id;
    private String title;
    private String description;
    private Date createdAt;
    private int likeCount;
    private boolean deleteStatus;
    private String createdBy;
    private List<String> mediaIds;
    private List<String> commentIds;
    private List<String> likeIds;

    // Default constructor
    public CookingPostDTO() {
    }

    // Overloaded constructor
    public CookingPostDTO(String id, String title, String description, Date createdAt, int likeCount,
                          boolean deleteStatus, String createdBy, List<String> mediaIds,
                          List<String> commentIds, List<String> likeIds) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.likeCount = likeCount;
        this.deleteStatus = deleteStatus;
        this.createdBy = createdBy;
        this.mediaIds = mediaIds;
        this.commentIds = commentIds;
        this.likeIds = likeIds;
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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

    public boolean isDeleteStatus() {
        return deleteStatus;
    }

    public void setDeleteStatus(boolean deleteStatus) {
        this.deleteStatus = deleteStatus;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public List<String> getMediaIds() {
        return mediaIds;
    }

    public void setMediaIds(List<String> mediaIds) {
        this.mediaIds = mediaIds;
    }

    public List<String> getCommentIds() {
        return commentIds;
    }

    public void setCommentIds(List<String> commentIds) {
        this.commentIds = commentIds;
    }

    public List<String> getLikeIds() {
        return likeIds;
    }

    public void setLikeIds(List<String> likeIds) {
        this.likeIds = likeIds;
    }
}