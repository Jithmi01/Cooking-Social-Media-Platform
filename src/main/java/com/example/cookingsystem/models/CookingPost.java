package com.example.cookingsystem.models;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import net.minidev.json.annotate.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "cooking_posts")
public class CookingPost {
    @Id
    private String id;
    private String title;
    private String description;
    private Date createdAt;
    private int likeCount;
    private boolean deleteStatus;

    @DBRef(lazy = true)
    @JsonSerialize(using = UserSerializer.class)

    private User createdBy;

    @DBRef(lazy = true)
    private List<Media> media;

    @DBRef(lazy = true)
    private List<Comment> comments;

    @DBRef(lazy = true)
    private List<Like> likes;

    // Default constructor
    public CookingPost() {
    }

    // Overloaded constructor
    public CookingPost(String id, String title, String description, Date createdAt, int likeCount,
                       boolean deleteStatus, User createdBy, List<Media> media,
                       List<Comment> comments, List<Like> likes) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.likeCount = likeCount;
        this.deleteStatus = deleteStatus;
        this.createdBy = createdBy;
        this.media = media;
        this.comments = comments;
        this.likes = likes;
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

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public List<Media> getMedia() {
        return media;
    }

    public void setMedia(List<Media> media) {
        this.media = media;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public List<Like> getLikes() {
        return likes;
    }

    public void setLikes(List<Like> likes) {
        this.likes = likes;
    }
}
