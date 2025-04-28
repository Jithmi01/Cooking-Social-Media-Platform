package com.example.cookingsystem.models;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "likes")
public class Like {
    @Id
    private String id;
    private Date likedAt;

    @DBRef(lazy = true)
    @JsonSerialize(using = UserSerializer.class)
    private User likedBy;



    // Default constructor
    public Like() {
    }

    // Overloaded constructor
    public Like(String id, Date likedAt, boolean deleteStatus, User likedBy, CookingPost likedPost) {
        this.id = id;
        this.likedAt = likedAt;
        this.likedBy = likedBy;
        
    }

    // Getters and setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Date getLikedAt() {
        return likedAt;
    }

    public void setLikedAt(Date likedAt) {
        this.likedAt = likedAt;
    }


    public User getLikedBy() {
        return likedBy;
    }

    public void setLikedBy(User likedBy) {
        this.likedBy = likedBy;
    }

}
