async function deleteAccount(axiosInstance) {
  try {
    await axiosInstance.delete('/users');
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

async function getAccountInfo(axiosInstance) {
  try {
    const response = await axiosInstance.get('/accounts/lookup');
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

async function getPersonalInfo(axiosInstance) {
  try {
    const response = await axiosInstance.get('/users/personal-info');
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

async function updateName(axiosInstance, { firstName, lastName }) {
  try {
    await axiosInstance.put('/users/name', { firstName, lastName });
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
  deleteAccount,
  getAccountInfo,
  getPersonalInfo,
  updateName,
};
