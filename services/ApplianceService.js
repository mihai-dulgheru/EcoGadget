import { Axios } from '../utils/Axios';

const addAppliance = async (applianceData) => {
  try {
    const response = await Axios.post('/appliances', applianceData);
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
};

const deleteAppliance = async (id) => {
  try {
    const response = await Axios.delete(`/appliances/${id}`);
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
};

const getAppliances = async () => {
  try {
    const response = await Axios.get('/appliances');
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
};

const updateAppliance = async (id, applianceData) => {
  try {
    const response = await Axios.put(`/appliances/${id}`, applianceData);
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
};

export default {
  addAppliance,
  deleteAppliance,
  getAppliances,
  updateAppliance,
};
