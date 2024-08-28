// src/components/FavoritesList.tsx
import React, { useEffect, useState } from 'react';
import { getFavorites, removeFavorite } from '../services/api';

const FavoritesList: React.FC = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await getFavorites(token);
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const handleRemoveFavorite = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await removeFavorite(token, id);
      fetchFavorites();
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Favorites</h2>
      <ul>
        {favorites.map((favorite) => (
          <li key={favorite.id} className="mb-2">
            <span>{favorite.linkedinUrl}</span>
            <button
              onClick={() => handleRemoveFavorite(favorite.id)}
              className="ml-2 text-red-500"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritesList;