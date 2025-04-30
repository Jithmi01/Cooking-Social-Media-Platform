package com.example.cookingsystem.dtos;

import java.util.List;

public class PagedFollowResponseDTO {
    private List<UserFollowInfoDTO> users;
    private int totalPages;
    private long totalElements;
    private int currentPage;

    public PagedFollowResponseDTO() {
    }

    public PagedFollowResponseDTO(List<UserFollowInfoDTO> users, int totalPages, long totalElements, int currentPage) {
        this.users = users;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
        this.currentPage = currentPage;
    }

    // Getters and setters
    public List<UserFollowInfoDTO> getUsers() {
        return users;
    }

    public void setUsers(List<UserFollowInfoDTO> users) {
        this.users = users;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }
}