package com.example.cookingsystem.services;

import com.example.cookingsystem.dtos.GroupPostDTO;
import com.example.cookingsystem.exceptions.ResourceNotFoundException;
import com.example.cookingsystem.models.Group;
import com.example.cookingsystem.models.GroupPost;
import com.example.cookingsystem.models.User;
import com.example.cookingsystem.repositories.GroupPostRepository;
import com.example.cookingsystem.repositories.GroupRepository;
import com.example.cookingsystem.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;


public class GroupPostService {

    private final GroupPostRepository groupPostRepository;
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;

    @Autowired
    public GroupPostService(GroupPostRepository groupPostRepository,
                            UserRepository userRepository,
                            GroupRepository groupRepository) {
        this.groupPostRepository = groupPostRepository;
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
    }

    /**
     * Get all group posts (active only)
     */
    public List<GroupPostDTO.GroupPostResponse> getAllGroupPosts() {
        List<GroupPost> posts = groupPostRepository.findByDeleteStatusFalseOrderByCreatedAtDesc();
        return mapPostsToResponseDTOs(posts);
    }
    /**
     * Get group post by ID
     */
    public GroupPostDTO.GroupPostResponse getGroupPostById(String postId) {
        GroupPost post = findGroupPostById(postId);
        return mapPostToResponseDTO(post);
    }

    /**
     * Get posts by group ID
     */
    public List<GroupPostDTO.GroupPostResponse> getPostsByGroupId(String groupId) {
        // Verify group exists
        groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with ID: " + groupId));

        List<GroupPost> posts = groupPostRepository.findByPostedOnIdAndDeleteStatusFalseOrderByCreatedAtDesc(groupId);
        return mapPostsToResponseDTOs(posts);
    }

    /**
     * Get posts by user ID
     */
    public List<GroupPostDTO.GroupPostResponse> getPostsByUserId(String userId) {
        // Verify user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        List<GroupPost> posts = groupPostRepository.findByPostedByIdAndDeleteStatusFalseOrderByCreatedAtDesc(userId);
        return mapPostsToResponseDTOs(posts);
    }
    
}
