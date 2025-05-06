import axiosInstance from "../utils/axiosConfig";

const taskCompletionApi = {
  // Get all task completions (public access)
  getAllCompletions: async () => {
    try {
      const response = await axiosInstance.get("/task-completions");
      return response.data;
    } catch (error) {
      console.error("Error fetching task completions:", error);
      throw error;
    }
  },

  // Get completions by user ID (public access)
  getCompletionsByUser: async (userId) => {
    try {
      const response = await axiosInstance.get(
        `/task-completions/user/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching completions for user ${userId}:`, error);
      throw error;
    }
  },

  // Get completions by task ID (public access)
  getCompletionsByTask: async (taskId) => {
    try {
      const response = await axiosInstance.get(
        `/task-completions/task/${taskId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching completions for task ${taskId}:`, error);
      throw error;
    }
  },

  // Check if user completed a task (public access)
  checkCompletionStatus: async (userId, taskId) => {
    try {
      const response = await axiosInstance.get(
        `/task-completions/task/status/${userId}/${taskId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error checking completion status for user ${userId} and task ${taskId}:`,
        error
      );
      throw error;
    }
  },

  // Create task completion (public access)
  createCompletion: async (taskId, userId, spentTime) => {
    try {
      const response = await axiosInstance.post(
        "/task-completions/task/" + taskId,
        {
          taskId,
          userId,
          spentTime,
          completedBy: userId,
          task: taskId,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating task completion:", error);
      throw error;
    }
  },

  // Update completion time (public access)
  updateCompletionTime: async (completionId, newSpentTime) => {
    try {
      const response = await axiosInstance.put(
        `/task-completions/${completionId}`,
        {
          spentTime: newSpentTime,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating completion ${completionId}:`, error);
      throw error;
    }
  },

  // Delete completion (public access)
  deleteCompletion: async (completionId) => {
    try {
      const response = await axiosInstance.delete(
        `/task-completions/${completionId}`
      );
      return response.status === 204;
    } catch (error) {
      console.error(`Error deleting completion ${completionId}:`, error);
      throw error;
    }
  },
};

export default taskCompletionApi;
