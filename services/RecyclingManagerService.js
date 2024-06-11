async function deleteRecyclingLocation(axiosInstance, id) {
  try {
    const response = await axiosInstance.delete(
      `/recycling-manager/recycling-locations/${id}`
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
}

async function getStatistics(axiosInstance) {
  try {
    const response = await axiosInstance.get('/recycling-manager/statistics');
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
}

async function markMessageAsRead(axiosInstance, messageId) {
  try {
    const response = await axiosInstance.post(
      `/recycling-manager/messages/${messageId}/mark-as-read`
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
}

async function getRecyclingLocations(axiosInstance) {
  try {
    const response = await axiosInstance.get(
      '/recycling-manager/recycling-locations'
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
}

async function getMessages(axiosInstance) {
  try {
    const response = await axiosInstance.get('/recycling-manager/messages');
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
}

async function sendMessageResponse(axiosInstance, messageId, responseText) {
  try {
    const response = await axiosInstance.post(
      `/recycling-manager/messages/${messageId}/response`,
      { response: responseText }
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
}

export default {
  deleteRecyclingLocation,
  getMessages,
  getRecyclingLocations,
  getStatistics,
  markMessageAsRead,
  sendMessageResponse,
};
