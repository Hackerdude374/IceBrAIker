import { useState } from 'react';
import { getIceBreakerData } from '../services/api';

const Home = () => {
  const [name, setName] = useState('');
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setData(null);

    try {
      const result = await getIceBreakerData(name);
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">IceBrAIker</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          className="border border-gray-300 p-2 w-full rounded mb-4"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600"
        >
          Do Your Magic
        </button>
      </form>

      {loading && (
        <div className="mt-8 flex justify-center items-center">
          <div className="spinner"></div>
        </div>
      )}

      {data && (
        <div className="mt-8 bg-white p-8 rounded shadow-md w-full max-w-4xl fade-in">
          <div className="text-center fade-in mb-4">
            <img
              src={data.picture_url}
              alt="Profile Picture"
              className="w-40 h-40 rounded-full mx-auto mb-4 fade-in"
            />
          </div>
          <div className="fade-in mb-4">
            <h2 className="text-2xl font-bold mb-2">Summary</h2>
            <p>{data.summary_and_facts.summary}</p>
          </div>
          <div className="mt-4 fade-in mb-4">
            <h2 className="text-2xl font-bold mb-2">Interesting Facts</h2>
            <ul className="list-disc list-inside">
              {data.summary_and_facts.facts.map((fact: string, index: number) => (
                <li key={index}>{fact}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4 fade-in mb-4">
            <h2 className="text-2xl font-bold mb-2">Ice Breakers</h2>
            <ul className="list-disc list-inside">
              {data.ice_breakers.ice_breakers.map((iceBreaker: string, index: number) => (
                <li key={index}>{iceBreaker}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4 fade-in">
            <h2 className="text-2xl font-bold mb-2">Topics of Interest</h2>
            <ul className="list-disc list-inside">
              {data.interests.topics_of_interest.map((topic: string, index: number) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
