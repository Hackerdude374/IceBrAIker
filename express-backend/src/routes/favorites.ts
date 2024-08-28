// src/routes/favorites.ts
import express from 'express';
import { addFavorite, removeFavorite, getFavorites } from '../controllers/favoriteController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, addFavorite);
router.delete('/:id', authMiddleware, removeFavorite);
router.get('/', authMiddleware, getFavorites);

export default router;
