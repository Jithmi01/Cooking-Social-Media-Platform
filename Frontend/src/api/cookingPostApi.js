import axiosInstance from "../utils/axiosConfig";

const cookingPostApi = {
  // Get all cooking posts
  getAllPosts: async () => {
    try {
      const response = await axiosInstance.get("/posts");
      return response.data;
    } catch (error) {
      console.error("Error fetching cooking posts:", error);
      throw error;
    }
  },

  // Get posts by user ID
  getPostsByUser: async (userId) => {
    try {
      const response = await axiosInstance.get(`/posts/my-posts/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching posts for user ${userId}:`, error);
      throw error;
    }
  },

  // Get post by ID
  getPostById: async (id) => {
    try {
      const response = await axiosInstance.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching post with ID ${id}:`, error);
      throw error;
    }
  },

  // Create new post
  createPost: async (postData) => {
    try {
      const response = await axiosInstance.post("/posts", postData);
      return response.data;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },

  // Update post
  updatePost: async (id, postData) => {
    try {
      const response = await axiosInstance.put(`/posts/${id}`, postData);
      return response.data;
    } catch (error) {
      console.error(`Error updating post with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete post
  deletePost: async (id) => {
    try {
      const response = await axiosInstance.delete(`/posts/${id}`);
      return response.status === 204;
    } catch (error) {
      console.error(`Error deleting post with ID ${id}:`, error);
      throw error;
    }
  },

  // Like a post
  likePost: async (postId) => {
    try {
      const response = await axiosInstance.post(`/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      console.error(`Error liking post ${postId}:`, error);
      throw error;
    }
  },

  // Unlike a post
  unlikePost: async (postId) => {
    try {
      const response = await axiosInstance.post(`/posts/${postId}/unlike`);
      return response.data;
    } catch (error) {
      console.error(`Error unliking post ${postId}:`, error);
      throw error;
    }
  },
};

export default cookingPostApi;
