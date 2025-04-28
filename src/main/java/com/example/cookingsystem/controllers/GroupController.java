package com.example.cookingsystem.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.cookingsystem.dtos.GroupDTO;
import com.example.cookingsystem.services.GroupService;

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

}