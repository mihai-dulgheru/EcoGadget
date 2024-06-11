import { Axios } from '../utils/Axios';

async function deleteRecyclingLocation(axiosInstance, id) {
  try {
    const response = await axiosInstance.delete(
      `/recycling-manager/recycling-locations/${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Error deleting recycling location'
    );
  }
}

async function getStatistics(axiosInstance) {
  try {
    const response = await axiosInstance.get('/recycling-manager/statistics');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Error fetching statistics'
    );
  }
}

async function getRecyclingLocations(axiosInstance) {
  try {
    const response = await axiosInstance.get(
      '/recycling-manager/recycling-locations'
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Error fetching recycling locations'
    );
  }
}

async function getMessages() {
  try {
    const response = await Axios.get('/recycling-manager/messages');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching messages');
  }
}

export default {
  deleteRecyclingLocation,
  getMessages,
  getRecyclingLocations,
  getStatistics,
};
