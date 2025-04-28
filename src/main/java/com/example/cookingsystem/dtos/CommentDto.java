package com.example.cookingsystem.dtos;

import java.util.Date;

public class CommentDto {
    private String id;
    private String comment;
    private Date commentedAt;
    private boolean deleteStatus;
    private String commentedBy; // Only string (e.g., user ID or username)
    private String commentedOn; // Optional: ID of the CookingPost

    // Constructors
    public CommentDto() {}

    public CommentDto(String id, String comment, Date commentedAt, boolean deleteStatus,
                      String commentedBy, String commentedOn) {
        this.id = id;
        this.comment = comment;
        this.commentedAt = commentedAt;
        this.deleteStatus = deleteStatus;
        this.commentedBy = commentedBy;
        this.commentedOn = commentedOn;
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Date getCommentedAt() {
        return commentedAt;
    }

    public void setCommentedAt(Date commentedAt) {
        this.commentedAt = commentedAt;
    }

    public boolean isDeleteStatus() {
        return deleteStatus;
    }

    public void setDeleteStatus(boolean deleteStatus) {
        this.deleteStatus = deleteStatus;
    }

    public String getCommentedBy() {
        return commentedBy;
    }

    public void setCommentedBy(String commentedBy) {
        this.commentedBy = commentedBy;
    }

    public String getCommentedOn() {
        return commentedOn;
    }

    public void setCommentedOn(String commentedOn) {
        this.commentedOn = commentedOn;
    }
}
