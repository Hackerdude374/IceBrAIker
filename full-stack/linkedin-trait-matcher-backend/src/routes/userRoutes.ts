import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middlewares/auth';
import { matchProfiles } from '../services/matchingService';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/favorite', authMiddleware, async (req, res) => {
  const { favoritedUserId } = req.body;
  try {
    const favorite = await prisma.favorite.create({
      data: {
        userId: req.userId!,
        favoritedUserId
      }
    });
    res.json(favorite);
  } catch (error) {
    res.status(400).json({ error: 'Unable to add favorite' });
  }
});

router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.userId },
      include: { 
        user: {
          include: { profile: true }
        }
      }
    });
    res.json(favorites);
  } catch (error) {
    res.status(400).json({ error: 'Unable to retrieve favorites' });
  }
});

router.post('/match', authMiddleware, async (req, res) => {
  try {
    const matches = await matchProfiles(req.userId!);
    res.json(matches);
  } catch (error) {
    console.error('Error in profile matching:', error);
    res.status(500).json({ error: 'Failed to perform profile matching' });
  }
});

export default router;