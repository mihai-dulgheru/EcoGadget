const getAccountInfo = async (AxiosAuth) => {
  try {
    const response = await AxiosAuth.get('/accounts/lookup');
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
  getAccountInfo,
};
