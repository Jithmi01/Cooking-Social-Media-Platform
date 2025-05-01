package com.example.cookingsystem.services;

import com.example.cookingsystem.dtos.FollowStatusDTO;
import com.example.cookingsystem.dtos.PagedFollowResponseDTO;
import com.example.cookingsystem.dtos.UserFollowInfoDTO;
import com.example.cookingsystem.models.Follow;
import com.example.cookingsystem.models.User;
import com.example.cookingsystem.repositories.FollowRepository;
import com.example.cookingsystem.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    @Autowired
    public FollowService(FollowRepository followRepository, UserRepository userRepository) {
        this.followRepository = followRepository;
        this.userRepository = userRepository;
    }

    /**
     * Follow a user
     * @param followerId The ID of the user who wants to follow
     * @param followingId The ID of the user to be followed
     * @return True if follow was successful, false otherwise
     */
    @Transactional
    public boolean followUser(String followerId, String followingId) {
        // Check if users exist
        Optional<User> follower = userRepository.findById(followerId);
        Optional<User> following = userRepository.findById(followingId);

        if (follower.isEmpty() || following.isEmpty()) {
            return false;
        }

        // Check if the follow relationship already exists
        Optional<Follow> existingFollow = followRepository.findByFollowerIdAndFollowingId(followerId, followingId);
        if (existingFollow.isPresent()) {
            return false; // Already following
        }

        // Create and save the new follow relationship
        Follow follow = new Follow(followerId, followingId);
        followRepository.save(follow);

        // Update follower counts
        User followerUser = follower.get();
        followerUser.setFollowingCount(followerUser.getFollowingCount() + 1);
        userRepository.save(followerUser);

        User followingUser = following.get();
        followingUser.setFollowersCount(followingUser.getFollowersCount() + 1);
        userRepository.save(followingUser);

        return true;
    }

    /**
     * Unfollow a user
     * @param followerId The ID of the user who wants to unfollow
     * @param followingId The ID of the user to be unfollowed
     * @return True if unfollow was successful, false otherwise
     */
    @Transactional
    public boolean unfollowUser(String followerId, String followingId) {
        // Check if users exist
        Optional<User> follower = userRepository.findById(followerId);
        Optional<User> following = userRepository.findById(followingId);

        if (follower.isEmpty() || following.isEmpty()) {
            return false;
        }

        // Check if the follow relationship exists
        Optional<Follow> existingFollow = followRepository.findByFollowerIdAndFollowingId(followerId, followingId);
        if (existingFollow.isEmpty()) {
            return false; // Not following
        }

        // Delete the follow relationship
        followRepository.delete(existingFollow.get());

        // Update follower counts
        User followerUser = follower.get();
        followerUser.setFollowingCount(Math.max(0, followerUser.getFollowingCount() - 1));
        userRepository.save(followerUser);

        User followingUser = following.get();
        followingUser.setFollowersCount(Math.max(0, followingUser.getFollowersCount() - 1));
        userRepository.save(followingUser);

        return true;
    }

    /**
     * Check follow status between two users
     * @param userId Current user ID
     * @param targetUserId Target user ID
     * @return FollowStatusDTO containing follow status information
     */
    public FollowStatusDTO checkFollowStatus(String userId, String targetUserId) {
        boolean isFollowing = followRepository.findByFollowerIdAndFollowingId(userId, targetUserId).isPresent();
        boolean isFollower = followRepository.findByFollowerIdAndFollowingId(targetUserId, userId).isPresent();

        return new FollowStatusDTO(isFollowing, isFollower);
    }

    /**
     * Get users followers with pagination
     * @param userId User ID to get followers for
     * @param page Page number (0-based)
     * @param size Page size
     * @param currentUserId ID of current user to check follow status
     * @return Paginated response with followers
     */
    public PagedFollowResponseDTO getFollowers(String userId, int page, int size, String currentUserId) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Follow> followPage = followRepository.findByFollowingId(userId, pageable);

        List<UserFollowInfoDTO> followers = new ArrayList<>();

        for (Follow follow : followPage.getContent()) {
            Optional<User> userOpt = userRepository.findById(follow.getFollowerId());

            if (userOpt.isPresent()) {
                User user = userOpt.get();
                boolean isFollowing = !currentUserId.equals(userId) &&
                        followRepository.findByFollowerIdAndFollowingId(currentUserId, user.getId()).isPresent();

                followers.add(new UserFollowInfoDTO(
                        user.getId(),
                        user.getUsername(),
                        user.getName(),
                        user.getFollowersCount(),
                        user.getFollowingCount(),
                        isFollowing
                ));
            }
        }

        return new PagedFollowResponseDTO(
                followers,
                followPage.getTotalPages(),
                followPage.getTotalElements(),
                followPage.getNumber()
        );
    }

    /**
     * Get users following with pagination
     * @param userId User ID to get following users for
     * @param page Page number (0-based)
     * @param size Page size
     * @param currentUserId ID of current user to check follow status
     * @return Paginated response with following users
     */
    public PagedFollowResponseDTO getFollowing(String userId, int page, int size, String currentUserId) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Follow> followPage = followRepository.findByFollowerId(userId, pageable);

        List<UserFollowInfoDTO> following = new ArrayList<>();

        for (Follow follow : followPage.getContent()) {
            Optional<User> userOpt = userRepository.findById(follow.getFollowingId());

            if (userOpt.isPresent()) {
                User user = userOpt.get();
                boolean isFollowing = !currentUserId.equals(userId) &&
                        followRepository.findByFollowerIdAndFollowingId(currentUserId, user.getId()).isPresent();

                following.add(new UserFollowInfoDTO(
                        user.getId(),
                        user.getUsername(),
                        user.getName(),
                        user.getFollowersCount(),
                        user.getFollowingCount(),
                        isFollowing
                ));
            }
        }

        return new PagedFollowResponseDTO(
                following,
                followPage.getTotalPages(),
                followPage.getTotalElements(),
                followPage.getNumber()
        );
    }
}