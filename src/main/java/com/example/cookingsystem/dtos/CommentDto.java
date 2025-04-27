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


    public void setId(String id) {
        this.id = id;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public void setCommentedAt(Date commentedAt) {
        this.commentedAt = commentedAt;
    }

    public void setDeleteStatus(boolean deleteStatus) {
        this.deleteStatus = deleteStatus;
    }

    public void setCommentedBy(String commentedBy) {
        this.commentedBy = commentedBy;
    }

    public void setCommentedOn(String commentedOn) {
        this.commentedOn = commentedOn;
    }
}
