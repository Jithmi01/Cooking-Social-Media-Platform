package com.example.cookingsystem.controllers;

import com.example.cookingsystem.dtos.GroupDTO;
import com.example.cookingsystem.services.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    private final GroupService groupService;

    @Autowired
    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    /**
     * Get all groups
     */
    @GetMapping
    public ResponseEntity<List<GroupDTO.GroupResponse>> getAllGroups() {
        List<GroupDTO.GroupResponse> groups = groupService.getAllGroups();
        return ResponseEntity.ok(groups);
    }

    /**
     * Get a specific group by ID
     */
    @GetMapping("/{groupId}")
    public ResponseEntity<GroupDTO.GroupResponse> getGroupById(@PathVariable String groupId) {
        GroupDTO.GroupResponse group = groupService.getGroupById(groupId);
        return ResponseEntity.ok(group);
    }

    /**
     * Get groups for a specific user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<GroupDTO.GroupResponse>> getGroupsByUserId(@PathVariable String userId) {
        List<GroupDTO.GroupResponse> groups = groupService.getGroupsByUserId(userId);
        return ResponseEntity.ok(groups);
    }

    /**
     * Create a new group
     */
    @PostMapping
    public ResponseEntity<GroupDTO.GroupResponse> createGroup(@RequestBody GroupDTO.GroupRequest groupRequest) {
        GroupDTO.GroupResponse createdGroup = groupService.createGroup(groupRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdGroup);
    }

    /**
     * Update an existing group
     */
    @PutMapping("/{groupId}")
    public ResponseEntity<GroupDTO.GroupResponse> updateGroup(
            @PathVariable String groupId,
            @RequestBody GroupDTO.GroupRequest groupRequest) {
        GroupDTO.GroupResponse updatedGroup = groupService.updateGroup(groupId, groupRequest);
        return ResponseEntity.ok(updatedGroup);
    }

    /**
     * Delete a group (soft delete)
     */
    @DeleteMapping("/{groupId}")
    public ResponseEntity<Void> deleteGroup(@PathVariable String groupId) {
        groupService.deleteGroup(groupId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Add a single user to a group
     */
    @PostMapping("/{groupId}/members/{userId}")
    public ResponseEntity<GroupDTO.GroupResponse> addUserToGroup(
            @PathVariable String groupId,
            @PathVariable String userId) {
        GroupDTO.GroupResponse updatedGroup = groupService.addUserToGroup(groupId, userId);
        return ResponseEntity.ok(updatedGroup);
    }

    /**
     * Add multiple users to a group
     */
    @PostMapping("/{groupId}/members")
    public ResponseEntity<GroupDTO.GroupResponse> addUsersToGroup(
            @PathVariable String groupId,
            @RequestBody GroupDTO.AddMembersRequest request) {
        GroupDTO.GroupResponse updatedGroup = groupService.addUsersToGroup(groupId, request);
        return ResponseEntity.ok(updatedGroup);
    }

    /**
     * Remove a user from a group
     */
    @DeleteMapping("/{groupId}/members/{userId}")
    public ResponseEntity<GroupDTO.GroupResponse> removeUserFromGroup(
            @PathVariable String groupId,
            @PathVariable String userId) {
        GroupDTO.GroupResponse updatedGroup = groupService.removeUserFromGroup(groupId, userId);
        return ResponseEntity.ok(updatedGroup);
    }
}