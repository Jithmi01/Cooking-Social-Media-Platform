package com.example.cookingsystem.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "media")
public class Media {
    @Id
    private String id;
    private String type; // image, video, etc.
    private String url;
    private boolean deleteStatus;

    @DBRef(lazy = true)
    private CookingPost relatedPost;

    // Default constructor
    public Media() {
    }

    // Overloaded constructor
    public Media(String id, String type, String url, boolean deleteStatus, CookingPost relatedPost) {
        this.id = id;
        this.type = type;
        this.url = url;
        this.deleteStatus = deleteStatus;
        this.relatedPost = relatedPost;
    }

    // Getters and setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public boolean isDeleteStatus() {
        return deleteStatus;
    }

    public void setDeleteStatus(boolean deleteStatus) {
        this.deleteStatus = deleteStatus;
    }

    public CookingPost getRelatedPost() {
        return relatedPost;
    }

    public void setRelatedPost(CookingPost relatedPost) {
        this.relatedPost = relatedPost;
    }
}
