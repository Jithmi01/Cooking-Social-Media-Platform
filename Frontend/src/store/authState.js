import { proxy,  } from 'valtio';


export const authState = proxy({
    isAuthenticated: false,
    userId: null,
    
    // Method to check if user is logged in
    checkAuth() {
      const userId = localStorage.getItem('userId');
      this.isAuthenticated = !!userId;
      this.userId = userId;
    },
    
    // Method for logging out
    logout() {
      localStorage.removeItem('userId');
      this.isAuthenticated = false;
      this.userId = null;
    }
  });