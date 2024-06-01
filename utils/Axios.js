import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../store/AuthContext';

const Axios = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL.replace(/\/+$/, ''),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

function useAxiosAuth() {
  const { token } = useContext(AuthContext);

  const AxiosAuth = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL.replace(/\/+$/, ''),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    timeout: 5000,
    withCredentials: true,
  });

  return AxiosAuth;
}

export { Axios, useAxiosAuth };
