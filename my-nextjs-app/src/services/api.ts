import axios from 'axios';
import { User, UserProfile } from '../types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

console.log('API_URL:', API_URL); // Debug log

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface AuthResponse {
  token: string;
  user: User;
}

export const registerUser = async (email: string, password: string, name: string): Promise<AuthResponse> => {
  console.log('Registering user:', { email, name }); // Debug log
  const response = await axiosInstance.post('/auth/register', { email, password, name });
  return response.data;
};


export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data;
};


export const logoutUser = async (): Promise<void> => {
  await axios.post(`${API_URL}/auth/logout`);
};

export const loginWithLinkedIn = async (): Promise<void> => {
  window.location.href = `${API_URL}/auth/linkedin`;
};

export const getUserProfile = async (userId: number): Promise<UserProfile> => {
  const response = await axios.get(`${API_URL}/profiles/${userId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};

export const getIceBreakerData = async (name: string): Promise<any> => {
  const response = await axios.post(`${API_URL}/process`, { name }, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};