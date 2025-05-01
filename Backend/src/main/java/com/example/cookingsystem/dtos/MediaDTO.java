package com.example.cookingsystem.dtos;

public class MediaDTO {
    private String id;
    private String type;
    private String url;
    private boolean deleteStatus;
    private String relatedPost;

    // Default constructor
    public MediaDTO() {
    }

    // Overloaded constructor
    public MediaDTO(String id, String type, String url, boolean deleteStatus, String relatedPost) {
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

    public String getRelatedPost() {
        return relatedPost;
    }

    public void setRelatedPost(String relatedPost) {
        this.relatedPost = relatedPost;
    }
}
