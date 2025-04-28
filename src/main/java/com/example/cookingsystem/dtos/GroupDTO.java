package com.example.cookingsystem.dtos;

import com.example.cookingsystem.models.User;
import java.util.List;

public class GroupDTO {

    public static class GroupRequest {
        private String name;
        private String description;
        private List<String> memberIds;

        // Getters and setters
        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public List<String> getMemberIds() {
            return memberIds;
        }

        public void setMemberIds(List<String> memberIds) {
            this.memberIds = memberIds;
        }
    }

    public static class GroupResponse {
        private String id;
        private String name;
        private String description;
        private List<UserSummaryDTO> members;

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

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public List<UserSummaryDTO> getMembers() {
            return members;
        }

        public void setMembers(List<UserSummaryDTO> members) {
            this.members = members;
        }
    }

    public static class AddMembersRequest {
        private List<String> userIds;

        public List<String> getUserIds() {
            return userIds;
        }

        public void setUserIds(List<String> userIds) {
            this.userIds = userIds;
        }
    }

    public static class UserSummaryDTO {
        private String id;
        private String name;
        private String username;

        // Constructor
        public UserSummaryDTO(User user) {
            this.id = user.getId();
            this.name = user.getName();
            this.username = user.getUsername();
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

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }
    }
}