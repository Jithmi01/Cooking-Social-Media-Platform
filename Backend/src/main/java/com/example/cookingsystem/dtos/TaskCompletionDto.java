package com.example.cookingsystem.dtos;

import java.util.Date;

public class TaskCompletionDto {
    private String id;
    private Date completedAt;
    private int spentTime;
    private boolean deleteStatus;
    private String task;         // Task ID or name
    private String completedBy;  // User ID or username

    // Default constructor
    public TaskCompletionDto() {
    }

    // Overloaded constructor
    public TaskCompletionDto(String id, Date completedAt, int spentTime, boolean deleteStatus, String task, String completedBy) {
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

    public String getTask() {
        return task;
    }

    public void setTask(String task) {
        this.task = task;
    }

    public String getCompletedBy() {
        return completedBy;
    }

    public void setCompletedBy(String completedBy) {
        this.completedBy = completedBy;
    }
}
