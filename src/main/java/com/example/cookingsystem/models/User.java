package com.example.cookingsystem.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    private  String username;
    private String email;
    private Date birthday;
    private String password;
    private String gender;
    private int age;
    private boolean deleteStatus;
    private String badge;

    public int getFollowersCount() {
        return followersCount;
    }

    public void setFollowersCount(int followersCount) {
        this.followersCount = followersCount;
    }

    public int getFollowingCount() {
        return followingCount;
    }

    public void setFollowingCount(int followingCount) {
        this.followingCount = followingCount;
    }

    private int followersCount = 0;
    private int followingCount = 0;

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean aPublic) {
        isPublic = aPublic;
    }

    private  boolean isPublic;

    @DBRef(lazy = true)
    @JsonIgnore
    private List<CookingPost> posts;

    @DBRef(lazy = true)
    @JsonIgnore
    private List<Group> groups;

    @DBRef(lazy = true)
    @JsonIgnore
    private List<TaskCompletion> completedTasks;

    // Default constructor
    public User() {
    }

    // Overloaded constructor
    public User(String id, String name, String email, Date birthday, String password, String gender, int age,
                boolean deleteStatus, String badge, List<CookingPost> posts, List<Group> groups, List<TaskCompletion> completedTasks) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.birthday = birthday;
        this.password = password;
        this.gender = gender;
        this.age = age;
        this.deleteStatus = deleteStatus;
        this.badge = badge;
        this.posts = posts;
        this.groups = groups;
        this.completedTasks = completedTasks;
    }

    // Getters and setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Date getBirthday() {
        return birthday;
    }

    public void setBirthday(Date birthday) {
        this.birthday = birthday;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public boolean isDeleteStatus() {
        return deleteStatus;
    }

    public void setDeleteStatus(boolean deleteStatus) {
        this.deleteStatus = deleteStatus;
    }

    public String getBadge() {
        return badge;
    }

    public void setBadge(String badge) {
        this.badge = badge;
    }

    public List<CookingPost> getPosts() {
        return posts;
    }

    public void setPosts(List<CookingPost> posts) {
        this.posts = posts;
    }

    public List<Group> getGroups() {
        return groups;
    }

    public void setGroups(List<Group> groups) {
        this.groups = groups;
    }

    public List<TaskCompletion> getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(List<TaskCompletion> completedTasks) {
        this.completedTasks = completedTasks;
    }
}
