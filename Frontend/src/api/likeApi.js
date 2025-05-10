import axiosInstance from '../utils/axiosConfig';

const likeApi = {
  // Get all likes
  getAllLikes: async () => {
    try {
      const response = await axiosInstance.get('/likes');
      return response.data;
    } catch (error) {
      console.error('Error fetching likes:', error);
      throw error;
    }
  },

  // Get likes by post ID
  getLikesByPost: async (postId) => {
    try {
      const response = await axiosInstance.get(`/likes/post/${postId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching likes for post ${postId}:`, error);
      throw error;
    }
  },

  // Get like by ID
  getLikeById: async (id) => {
    try {
      const response = await axiosInstance.get(`/likes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching like with ID ${id}:`, error);
      throw error;
    }
  },

  // Create like
  createLike: async (postId) => {
    try {
      const response = await axiosInstance.post(`/likes/post/${postId}`,{
        userId:localStorage.getItem("userId"),
        postId
      });
      return response.data;
    } catch (error) {
      console.error(`Error creating like for post ${postId}:`, error);
      throw error;
    }
  },

  // Delete like
  deleteLike: async (id) => {
    try {
      const response = await axiosInstance.delete(`/likes/${id}`);
      return response.status === 204;
    } catch (error) {
      console.error(`Error deleting like with ID ${id}:`, error);
      throw error;
    }
  },

  // Check like status
  getLikeStatus: async (postId) => {
    try {
      const response = await axiosInstance.get(`/likes/post/${postId}/${localStorage.getItem("userId")}/status`);
      return response.data;
    } catch (error) {
      console.error(`Error checking like status for post ${postId}:`, error);
      throw error;
    }
  }
};

export default likeApi;