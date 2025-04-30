package com.example.cookingsystem.models;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "comments")
public class Comment {
    @Id
    private String id;
    private String comment;
    private boolean deleteStatus;

    @DBRef(lazy = true)
    @JsonSerialize(using = UserSerializer.class)
    private User commentedBy;

    @DBRef(lazy = true)
    private CookingPost commentedOn;

    // Default constructor
    public Comment() {
    }

    // Overloaded constructor
    public Comment(String id, String comment, boolean deleteStatus,
                   User commentedBy, CookingPost commentedOn) {
        this.id = id;
        this.comment = comment;
        this.deleteStatus = deleteStatus;
        this.commentedBy = commentedBy;
        this.commentedOn = commentedOn;
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

    public CookingPost getCommentedOn() {
        return commentedOn;
    }

    public void setCommentedOn(CookingPost commentedOn) {
        this.commentedOn = commentedOn;
    }
}
