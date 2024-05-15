import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../store/AuthContext';

const Axios = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

function useAxiosAuth() {
  const { token } = useContext(AuthContext);

  const AxiosAuth = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return AxiosAuth;
}

export { Axios, useAxiosAuth };
