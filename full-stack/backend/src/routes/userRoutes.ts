import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middlewares/auth';
import { matchProfiles } from '../services/matchingService';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { profile: true }
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Unable to retrieve user' });
  }
});

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