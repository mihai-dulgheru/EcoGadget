import axios from 'axios';

const sendContactMessage = async (data) => {
  try {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    const response = await axios.post(`${apiUrl}/messages`, data);
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
  sendContactMessage,
};
