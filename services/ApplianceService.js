async function addAppliance(axiosInstance, applianceData) {
  try {
    const response = await axiosInstance.post('/appliances', applianceData);
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

async function deleteAppliance(axiosInstance, id) {
  try {
    const response = await axiosInstance.delete(`/appliances/${id}`);
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

async function getAppliances(axiosInstance) {
  try {
    const response = await axiosInstance.get('/appliances');
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

async function getRecommendations(axiosInstance, location) {
  try {
    const response = await axiosInstance.post('/appliances/recommendations', {
      coordinates: [location.longitude, location.latitude],
    });
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

async function updateAppliance(axiosInstance, id, applianceData) {
  try {
    const response = await axiosInstance.put(
      `/appliances/${id}`,
      applianceData
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
  addAppliance,
  deleteAppliance,
  getAppliances,
  getRecommendations,
  updateAppliance,
};
