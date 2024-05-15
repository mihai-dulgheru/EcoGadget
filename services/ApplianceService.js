async function addAppliance(AxiosAuth, applianceData) {
  try {
    const response = await AxiosAuth.post('/appliances', applianceData);
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

async function deleteAppliance(AxiosAuth, id) {
  try {
    const response = await AxiosAuth.delete(`/appliances/${id}`);
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

async function getAppliances(AxiosAuth) {
  try {
    const response = await AxiosAuth.get('/appliances');
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

async function updateAppliance(AxiosAuth, id, applianceData) {
  try {
    const response = await AxiosAuth.put(`/appliances/${id}`, applianceData);
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
  updateAppliance,
};
