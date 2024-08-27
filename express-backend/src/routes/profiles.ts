import express from 'express';
import { analyzeProfile, favoriteProfile, getFavorites } from '../controllers/profileController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/analyze', authMiddleware, analyzeProfile);
router.post('/favorite', authMiddleware, favoriteProfile);
router.get('/favorites', authMiddleware, getFavorites);

export default router;