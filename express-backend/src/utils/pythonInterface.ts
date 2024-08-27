import axios from 'axios';

const PYTHON_API_URL = 'http://localhost:5000/api';

export async function analyzeProfile(linkedinUrl: string): Promise<any> {
  try {
    const response = await axios.post(`${PYTHON_API_URL}/analyze`, { linkedin_url: linkedinUrl });
    return response.data;
  } catch (error) {
    console.error('Error analyzing profile:', error);
    throw error;
  }
}