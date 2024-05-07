import { Axios } from './Axios';

async function authenticate(mode, email, password) {
  try {
    const response = await Axios.post(`/accounts/${mode}`, { email, password });
    const { idToken } = response.data;
    return idToken;
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

function signUp(email, password) {
  return authenticate('sign-up', email, password);
}

function signInWithPassword(email, password) {
  return authenticate('sign-in-with-password', email, password);
}

export { signInWithPassword, signUp };
