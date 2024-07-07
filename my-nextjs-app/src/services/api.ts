import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getIceBreakerData = async (name: string) => {
  const response = await axios.post(`${API_URL}/process`, { name });
  return response.data;
};
