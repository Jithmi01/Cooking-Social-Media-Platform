import axiosInstance from '../utils/axiosConfig';

const likeApi = {


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