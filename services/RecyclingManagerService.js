import { Axios } from '../utils/Axios';

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

async function getRecyclingLocations() {
  try {
    const response = await Axios.get('/recycling-manager/recycling-locations');
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
  getStatistics,
  getRecyclingLocations,
  getMessages,
};
