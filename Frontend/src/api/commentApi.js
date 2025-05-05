import axiosInstance from '../utils/axiosConfig';

const commentApi = {



  // Create comment
  createComment: async (postId, commentText) => {
    try {
      const response = await axiosInstance.post(`/comments/post/${postId}`, { 
        comment: commentText,
        commentedBy:localStorage.getItem("userId"), 
        deleteStatus:false,
        commentedOn: postId,
        commentedAt : new Date(),
      });
      return response.data;
    } catch (error) {
      console.error(`Error creating comment for post ${postId}:`, error);
      throw error;
    }
  },


  


};

export default commentApi;