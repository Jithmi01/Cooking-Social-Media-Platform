package com.example.cookingsystem.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "task_completions")
public class TaskCompletion {
    @Id
    private String id;
    private Date completedAt;
    private int spentTime; // in minutes
    private boolean deleteStatus;

    @DBRef(lazy = true)
    private Task task;

    @DBRef(lazy = true)
    private User completedBy;

    // Default constructor
    public TaskCompletion() {
    }

    // Overloaded constructor
    public TaskCompletion(String id, Date completedAt, int spentTime, boolean deleteStatus, Task task, User completedBy) {
        this.id = id;
        this.completedAt = completedAt;
        this.spentTime = spentTime;
        this.deleteStatus = deleteStatus;
        this.task = task;
        this.completedBy = completedBy;
    }

    // Getters and setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Date getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Date completedAt) {
        this.completedAt = completedAt;
    }

    public int getSpentTime() {
        return spentTime;
    }

    public void setSpentTime(int spentTime) {
        this.spentTime = spentTime;
    }

    public boolean isDeleteStatus() {
        return deleteStatus;
    }

    public void setDeleteStatus(boolean deleteStatus) {
        this.deleteStatus = deleteStatus;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public User getCompletedBy() {
        return completedBy;
    }

    public void setCompletedBy(User completedBy) {
        this.completedBy = completedBy;
    }
}
