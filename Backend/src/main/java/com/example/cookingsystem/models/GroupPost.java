package com.example.cookingsystem.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "group_posts")
public class GroupPost {
    @Id
    private String id;
    private String title;
    private String description;
    private String mediaUrl;
    private boolean deleteStatus;
    private Date createdAt;

    @DBRef(lazy = true)
    private User postedBy;

    @DBRef(lazy = true)
    private Group postedOn;

    // Default constructor
    public GroupPost() {
        this.createdAt = new Date();
    }

    // Overloaded constructor
    public GroupPost(String id, String title, String description, String mediaUrl,
                     boolean deleteStatus, User postedBy, Group postedOn) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.mediaUrl = mediaUrl;
        this.deleteStatus = deleteStatus;
        this.postedBy = postedBy;
        this.postedOn = postedOn;
        this.createdAt = new Date();
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

    public String getMediaUrl() {
        return mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    public boolean isDeleteStatus() {
        return deleteStatus;
    }

    public void setDeleteStatus(boolean deleteStatus) {
        this.deleteStatus = deleteStatus;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public User getPostedBy() {
        return postedBy;
    }

    public void setPostedBy(User postedBy) {
        this.postedBy = postedBy;
    }

    public Group getPostedOn() {
        return postedOn;
    }

    public void setPostedOn(Group postedOn) {
        this.postedOn = postedOn;
    }
}