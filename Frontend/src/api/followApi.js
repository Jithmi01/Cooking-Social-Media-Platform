import axiosInstance from "../utils/axiosConfig";

const followApi = {
  // Follow a user
  followUser: async (targetUserId) => {
    try {
      const followerId = localStorage.getItem("userId");
      const response = await axiosInstance.post("/follows/follow", {
        followerId: followerId,
        followingId: targetUserId,
      });
      return response.data;
    } catch (error) {
      console.error(`Error following user ${targetUserId}:`, error);
      throw error;
    }
  },

  // Unfollow a user
  unfollowUser: async (targetUserId) => {
    try {
      const followerId = localStorage.getItem("userId");
      const response = await axiosInstance.post("/follows/unfollow", {
        followerId: followerId,
        followingId: targetUserId,
      });
      return response.data;
    } catch (error) {
      console.error(`Error unfollowing user ${targetUserId}:`, error);
      throw error;
    }
  },

  // Check follow status between current user and target user
  checkFollowStatus: async (targetUserId) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axiosInstance.get(
        `/follows/status?userId=${userId}&targetUserId=${targetUserId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error checking follow status for user ${targetUserId}:`,
        error
      );
      throw error;
    }
  },

  // Get followers of a user
  getFollowers: async (userId, page = 0, size = 20) => {
    try {
      const currentUserId = localStorage.getItem("userId");
      const response = await axiosInstance.get(
        `/follows/${userId}/followers?page=${page}&size=${size}&currentUserId=${currentUserId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching followers of user ${userId}:`, error);
      throw error;
    }
  },

  // Get users followed by a user
  getFollowing: async (userId, page = 0, size = 20) => {
    try {
      const currentUserId = localStorage.getItem("userId");
      const response = await axiosInstance.get(
        `/follows/${userId}/following?page=${page}&size=${size}&currentUserId=${currentUserId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching following of user ${userId}:`, error);
      throw error;
    }
  },

  // Get current user's followers
  getMyFollowers: async (page = 0, size = 20) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axiosInstance.get(
        `/follows/${userId}/followers?page=${page}&size=${size}&currentUserId=${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching my followers:", error);
      throw error;
    }
  },

  // Get users followed by current user
  getMyFollowing: async (page = 0, size = 20) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axiosInstance.get(
        `/follows/${userId}/following?page=${page}&size=${size}&currentUserId=${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching my following:", error);
      throw error;
    }
  },
};

export default followApi;
