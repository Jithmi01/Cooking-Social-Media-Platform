package com.example.cookingsystem.models;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@Document(collection = "comments")
public class Comment {
    @Id
    private String id;
    private String comment;
    private Date commentedAt;
    private boolean deleteStatus;

    @DBRef(lazy = true)
    @JsonSerialize(using = UserSerializer.class)
    private User commentedBy;

    
    // Default constructor
    public Comment() {
    }

    // Overloaded constructor
    public Comment(String id, String comment, Date commentedAt, boolean deleteStatus,
                   User commentedBy) {
        this.id = id;
        this.comment = comment;
        this.commentedAt = commentedAt;
        this.deleteStatus = deleteStatus;
        this.commentedBy = commentedBy;
        
    }

    // Getters and setters

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

    public User getCommentedBy() {
        return commentedBy;
    }

    public void setCommentedBy(User commentedBy) {
        this.commentedBy = commentedBy;
    }


}
