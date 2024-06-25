import { Axios } from '../utils/Axios';

async function forgotPassword({ email }) {
  try {
    const response = await Axios.post('/accounts/forgot-password', { email });
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

async function resetPassword({ email, password, confirmPassword, code }) {
  try {
    const response = await Axios.post('/accounts/reset-password', {
      email,
      password,
      confirmPassword,
      code,
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

async function verifyResetCode({ email, code }) {
  try {
    const response = await Axios.post('/accounts/verify-reset-code', {
      email,
      code,
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

export default {
  forgotPassword,
  resetPassword,
  verifyResetCode,
};
