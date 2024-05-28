import { Axios } from './Axios';

async function authenticateUser(type, userCredentials) {
  try {
    const response = await Axios.post(`/accounts/${type}`, userCredentials);
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

function signUp(credentials) {
  return authenticateUser('sign-up', credentials);
}

function signInWithPassword(credentials) {
  return authenticateUser('sign-in-with-password', credentials);
}

export { signInWithPassword, signUp };
