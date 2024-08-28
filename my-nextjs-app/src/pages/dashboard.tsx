// src/pages/dashboard.tsx
import React, { useEffect, useState } from 'react';
import FavoritesList from '../components/FavoritesList';
import { getMatches } from '../services/api';

const Dashboard: React.FC = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await getMatches(token);
      setMatches(data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FavoritesList />
        <div>
          <h2 className="text-2xl font-bold mb-4">Matches</h2>
          <ul>
            {matches.map((match) => (
              <li key={match.favoriteId} className="mb-2">
                <span>{match.profileData.summary}</span>
                <span className="ml-2 text-gray-500">
                  Similarity: {(match.similarity * 100).toFixed(2)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;