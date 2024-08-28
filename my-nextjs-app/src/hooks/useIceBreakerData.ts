import { useState } from 'react';
import { getIceBreakerData } from '../services/api';
import { IceBreakerData } from '../types/iceBreaker';

export const useIceBreakerData = () => {
  const [data, setData] = useState<IceBreakerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (name: string) => {
    setLoading(true);
    setData(null);
    setError(null);

    try {
      const result = await getIceBreakerData(name);
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData };
};

export default useIceBreakerData;