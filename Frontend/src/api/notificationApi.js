import axiosInstance from "../utils/axiosConfig";

const notificationApi = {
  // Get all notifications (public access)
  getAllNotifications: async () => {
    try {
      const response = await axiosInstance.get("/notifications");
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  // Get notifications for a specific user (public access)
  getUserNotifications: async (userId) => {
    try {
      const response = await axiosInstance.get(
        `/notifications/my-notifications/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching notifications for user ${userId}:`, error);
      throw error;
    }
  },

  // Get notification by ID (public access)
  getNotificationById: async (id) => {
    try {
      const response = await axiosInstance.get(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching notification with ID ${id}:`, error);
      throw error;
    }
  },

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
