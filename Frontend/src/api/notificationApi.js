import axiosInstance from "../utils/axiosConfig";

const notificationApi = {


  // Create notification (public access)
  createNotification: async (notificationData) => {
    try {
      const response = await axiosInstance.post(
        "/notifications",
        notificationData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  },

  // Create notification for specific user (public access)
  createUserNotification: async (userId, title, subtitle) => {
    try {
      const response = await axiosInstance.post(
        `/notifications/user/${userId}`,
        {
          title,
          subtitle,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error creating notification for user ${userId}:`, error);
      throw error;
    }
  },


  // Mark notification as read (public access)
  markAsRead: async (id) => {
    try {
      const response = await axiosInstance.patch(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      console.error(`Error marking notification ${id} as read:`, error);
      throw error;
    }
  },

};

export default notificationApi;
