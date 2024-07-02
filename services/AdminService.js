const AdminService = {
  getUsers: async (axiosInstance) => {
    try {
      const response = await axiosInstance.get('/admin/users');
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else if (error.request) {
        throw new Error('No response from the server');
      } else {
        throw new Error('An error occurred');
      }
    }
  },
  getRecyclingManagers: async (axiosInstance) => {
    try {
      const response = await axiosInstance.get('/admin/recycling-managers');
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else if (error.request) {
        throw new Error('No response from the server');
      } else {
        throw new Error('An error occurred');
      }
    }
  },
  addUser: async (axiosInstance, user) => {
    try {
      const response = await axiosInstance.post('/admin/users', user);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else if (error.request) {
        throw new Error('No response from the server');
      } else {
        throw new Error('An error occurred');
      }
    }
  },
  updateUser: async (axiosInstance, id, user) => {
    try {
      const response = await axiosInstance.put(`/admin/users/${id}`, user);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else if (error.request) {
        throw new Error('No response from the server');
      } else {
        throw new Error('An error occurred');
      }
    }
  },
  deleteUser: async (axiosInstance, id) => {
    try {
      const response = await axiosInstance.delete(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else if (error.request) {
        throw new Error('No response from the server');
      } else {
        throw new Error('An error occurred');
      }
    }
  },
  addRecyclingManager: async (axiosInstance, manager) => {
    try {
      const response = await axiosInstance.post(
        '/admin/recycling-managers',
        manager
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else if (error.request) {
        throw new Error('No response from the server');
      } else {
        throw new Error('An error occurred');
      }
    }
  },
  updateRecyclingManager: async (axiosInstance, id, manager) => {
    try {
      const response = await axiosInstance.put(
        `/admin/recycling-managers/${id}`,
        manager
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else if (error.request) {
        throw new Error('No response from the server');
      } else {
        throw new Error('An error occurred');
      }
    }
  },
  deleteRecyclingManager: async (axiosInstance, id) => {
    try {
      const response = await axiosInstance.delete(
        `/admin/recycling-managers/${id}`
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else if (error.request) {
        throw new Error('No response from the server');
      } else {
        throw new Error('An error occurred');
      }
    }
  },
};

export default AdminService;
