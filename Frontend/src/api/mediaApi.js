import axiosInstance from '../utils/axiosConfig';

const mediaApi = {
  // Get all media items (public access)
  getAllMedia: async () => {
    try {
      const response = await axiosInstance.get('/media');
      return response.data;
    } catch (error) {
      console.error('Error fetching media items:', error);
      throw error;
    }
  },

  // Get media by ID (public access)
  getMediaById: async (id) => {
    try {
      const response = await axiosInstance.get(`/media/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching media item ${id}:`, error);
      throw error;
    }
  },

  // Get media by post ID (public access)
  getMediaByPostId: async (postId) => {
    try {
      const response = await axiosInstance.get(`/media/post/${postId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching media for post ${postId}:`, error);
      throw error;
    }
  },

  // Create media item (public access)
  createMedia: async (mediaData) => {
    try {
      const response = await axiosInstance.post('/media/post/'+mediaData.relatedPost, mediaData);
      return response.data;
    } catch (error) {
      console.error('Error creating media item:', error);
      throw error;
    }
  },

  // Upload media file (public access)
  uploadMedia: async (file, type, postId) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('postId', postId);

      const response = await axiosInstance.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  },

  // Update media item (public access)
  updateMedia: async (id, mediaData) => {
    try {
      const response = await axiosInstance.put(`/media/${id}`, mediaData);
      return response.data;
    } catch (error) {
      console.error(`Error updating media item ${id}:`, error);
      throw error;
    }
  },

  // Delete media item (public access)
  deleteMedia: async (id) => {
    try {
      const response = await axiosInstance.delete(`/media/${id}`);
      return response.status === 204;
    } catch (error) {
      console.error(`Error deleting media item ${id}:`, error);
      throw error;
    }
  },

  // Get media URL (public access)
  getMediaUrl: (mediaPath) => {
    return `${axiosInstance.defaults.baseURL}/media/files/${mediaPath}`;
  }
};

export default mediaApi;