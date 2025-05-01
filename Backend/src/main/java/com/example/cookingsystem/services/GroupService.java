package com.example.cookingsystem.services;

import com.example.cookingsystem.dtos.GroupDTO;
import com.example.cookingsystem.exceptions.ResourceNotFoundException;
import com.example.cookingsystem.models.Group;
import com.example.cookingsystem.models.User;
import com.example.cookingsystem.repositories.GroupRepository;
import com.example.cookingsystem.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroupService {

    private final GroupRepository groupRepository;
    private final UserRepository userRepository;

    @Autowired
    public GroupService(GroupRepository groupRepository, UserRepository userRepository) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
    }

    /**
     * Get all active groups
     */
    public List<GroupDTO.GroupResponse> getAllGroups() {
        List<Group> groups = groupRepository.findByDeleteStatusFalse();
        return mapGroupsToResponseDTOs(groups);
    }

    /**
     * Get groups by user ID
     */
    public List<GroupDTO.GroupResponse> getGroupsByUserId(String userId) {
        // Verify user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        List<Group> groups = groupRepository.findByMembersIdAndDeleteStatusFalse(userId);
        return mapGroupsToResponseDTOs(groups);
    }

    /**
     * Get group by ID
     */
    public GroupDTO.GroupResponse getGroupById(String groupId) {
        Group group = findGroupById(groupId);
        return mapGroupToResponseDTO(group);
    }

    /**
     * Create a new group
     */
    @Transactional
    public GroupDTO.GroupResponse createGroup(GroupDTO.GroupRequest groupRequest) {
        // Create new group
        Group group = new Group();
        group.setName(groupRequest.getName());
        group.setDescription(groupRequest.getDescription());
        group.setDeleteStatus(false);

        // Process member IDs if provided
        List<User> members = new ArrayList<>();
        if (groupRequest.getMemberIds() != null && !groupRequest.getMemberIds().isEmpty()) {
            members = getUsersFromIds(groupRequest.getMemberIds());
        }
        group.setMembers(members);

        // Save the group
        Group savedGroup = groupRepository.save(group);

        // Update the users' groups list
        for (User user : members) {
            if (user.getGroups() == null) {
                user.setGroups(new ArrayList<>());
            }
            user.getGroups().add(savedGroup);
            userRepository.save(user);
        }

        return mapGroupToResponseDTO(savedGroup);
    }

    /**
     * Update a group
     */
    @Transactional
    public GroupDTO.GroupResponse updateGroup(String groupId, GroupDTO.GroupRequest groupRequest) {
        Group group = findGroupById(groupId);

        // Update basic properties
        group.setName(groupRequest.getName());
        group.setDescription(groupRequest.getDescription());

        // Save the updated group
        Group updatedGroup = groupRepository.save(group);
        return mapGroupToResponseDTO(updatedGroup);
    }

    /**
     * Delete a group (soft delete)
     */
    @Transactional
    public void deleteGroup(String groupId) {
        Group group = findGroupById(groupId);

        // Soft delete the group
        group.setDeleteStatus(true);
        groupRepository.save(group);

        // Update user references
        for (User user : group.getMembers()) {
            user.getGroups().removeIf(g -> g.getId().equals(groupId));
            userRepository.save(user);
        }
    }

    /**
     * Add a single user to a group
     */
    @Transactional
    public GroupDTO.GroupResponse addUserToGroup(String groupId, String userId) {
        Group group = findGroupById(groupId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        // Check if user is already a member
        if (group.getMembers().stream().anyMatch(member -> member.getId().equals(userId))) {
            throw new IllegalArgumentException("User is already a member of this group");
        }

        // Add user to group
        group.getMembers().add(user);
        Group updatedGroup = groupRepository.save(group);

        // Add group to user's groups
        if (user.getGroups() == null) {
            user.setGroups(new ArrayList<>());
        }
        user.getGroups().add(group);
        userRepository.save(user);

        return mapGroupToResponseDTO(updatedGroup);
    }

    /**
     * Add multiple users to a group
     */
    @Transactional
    public GroupDTO.GroupResponse addUsersToGroup(String groupId, GroupDTO.AddMembersRequest request) {
        Group group = findGroupById(groupId);
        List<String> userIds = request.getUserIds();

        // Get all the users
        List<User> usersToAdd = getUsersFromIds(userIds);

        // Filter out users already in the group
        List<String> existingUserIds = group.getMembers().stream()
                .map(User::getId)
                .collect(Collectors.toList());

        List<User> newUsers = usersToAdd.stream()
                .filter(user -> !existingUserIds.contains(user.getId()))
                .collect(Collectors.toList());

        if (newUsers.isEmpty()) {
            throw new IllegalArgumentException("All specified users are already members of this group");
        }

        // Add new users to group
        group.getMembers().addAll(newUsers);
        Group updatedGroup = groupRepository.save(group);

        // Add group to each user's groups list
        for (User user : newUsers) {
            if (user.getGroups() == null) {
                user.setGroups(new ArrayList<>());
            }
            user.getGroups().add(group);
            userRepository.save(user);
        }

        return mapGroupToResponseDTO(updatedGroup);
    }

    /**
     * Remove a user from a group
     */
    @Transactional
    public GroupDTO.GroupResponse removeUserFromGroup(String groupId, String userId) {
        Group group = findGroupById(groupId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        // Remove user from group
        boolean removed = group.getMembers().removeIf(member -> member.getId().equals(userId));

        if (!removed) {
            throw new IllegalArgumentException("User is not a member of this group");
        }

        Group updatedGroup = groupRepository.save(group);

        // Remove group from user's groups
        user.getGroups().removeIf(g -> g.getId().equals(groupId));
        userRepository.save(user);

        return mapGroupToResponseDTO(updatedGroup);
    }

    // Helper methods
    private Group findGroupById(String groupId) {
        Group group = groupRepository.findByIdAndDeleteStatusFalse(groupId);
        if (group == null) {
            throw new ResourceNotFoundException("Group not found with ID: " + groupId);
        }
        return group;
    }

    private List<User> getUsersFromIds(List<String> userIds) {
        List<User> users = userRepository.findAllById(userIds);

        // Check if all IDs were found
        if (users.size() != userIds.size()) {
            List<String> foundIds = users.stream().map(User::getId).collect(Collectors.toList());
            List<String> notFoundIds = userIds.stream()
                    .filter(id -> !foundIds.contains(id))
                    .collect(Collectors.toList());

            throw new ResourceNotFoundException("Users not found with IDs: " + String.join(", ", notFoundIds));
        }

        return users;
    }

    private GroupDTO.GroupResponse mapGroupToResponseDTO(Group group) {
        GroupDTO.GroupResponse response = new GroupDTO.GroupResponse();
        response.setId(group.getId());
        response.setName(group.getName());
        response.setDescription(group.getDescription());

        List<GroupDTO.UserSummaryDTO> memberDTOs = group.getMembers().stream()
                .map(GroupDTO.UserSummaryDTO::new)
                .collect(Collectors.toList());

        response.setMembers(memberDTOs);
        return response;
    }

    private List<GroupDTO.GroupResponse> mapGroupsToResponseDTOs(List<Group> groups) {
        return groups.stream()
                .map(this::mapGroupToResponseDTO)
                .collect(Collectors.toList());
    }
}