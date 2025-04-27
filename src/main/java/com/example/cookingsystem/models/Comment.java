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
    private Date commentedAt;
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
    public Comment(String id, String comment, Date commentedAt, boolean deleteStatus,
                   User commentedBy, CookingPost commentedOn) {
        this.id = id;
        this.comment = comment;
        this.commentedAt = commentedAt;
        this.deleteStatus = deleteStatus;
        this.commentedBy = commentedBy;
        this.commentedOn = commentedOn;
    }

    // Getters and setters

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


    public void setCommentedBy(User commentedBy) {
        this.commentedBy = commentedBy;
    }

    public void setCommentedOn(CookingPost commentedOn) {
        this.commentedOn = commentedOn;
    }
}
