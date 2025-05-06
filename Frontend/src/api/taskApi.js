import axiosInstance from '../utils/axiosConfig';

const taskApi = {
  // Get all tasks (public access)
  getAllTasks: async () => {
    try {
      const response = await axiosInstance.get('/tasks');
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Get tasks by type (public access)
  getTasksByType: async (type) => {
    try {
      const response = await axiosInstance.get(`/tasks/type/${type}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${type} tasks:`, error);
      throw error;
    }
  },

  // Get task by ID (public access)
  getTaskById: async (id) => {
    try {
      const response = await axiosInstance.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw error;
    }
  },

  // Create task (public access)
  createTask: async (taskData) => {
    try {
      const response = await axiosInstance.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Update task (public access)
  updateTask: async (id, taskData) => {
    try {
      const response = await axiosInstance.put(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      throw error;
    }
  },

  // Delete task (public access)
  deleteTask: async (id) => {
    try {
      const response = await axiosInstance.delete(`/tasks/${id}`);
      return response.status === 204;
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw error;
    }
  }
};

export default taskApi;