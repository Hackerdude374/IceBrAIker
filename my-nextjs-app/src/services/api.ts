import axios from 'axios';
import { IceBreakerData } from '../types/iceBreaker';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getIceBreakerData = async (name: string): Promise<IceBreakerData> => {
  const response = await axios.post(`${API_URL}/process`, { name });
  return response.data;
};