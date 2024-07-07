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
    <div>
      <h1>IceBrAIker</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          required
        />
        <button type="submit">Do Your Magic</button>
      </form>

      {loading && <div className="three-quarters-loader"></div>}

      {data && (
        <div>
          <div>
            <img src={data.picture_url} alt="Profile Picture" style={{ width: '300px', maxWidth: '100%', height: 'auto', borderRadius: '50%', marginBottom: '20px' }} />
          </div>
          <div>
            <h2>Summary</h2>
            <p>{data.summary_and_facts.summary}</p>
          </div>
          <div>
            <h2>Interesting Facts</h2>
            <ul>
              {data.summary_and_facts.facts.map((fact: string, index: number) => (
                <li key={index}>{fact}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Ice Breakers</h2>
            <ul>
              {data.ice_breakers.ice_breakers.map((iceBreaker: string, index: number) => (
                <li key={index}>{iceBreaker}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Topics of Interest</h2>
            <ul>
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
