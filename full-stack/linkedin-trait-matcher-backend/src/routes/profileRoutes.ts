import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middlewares/auth';
import { searchLinkedInProfile } from '../services/tavilyService';
import { analyzeTraits, generateIceBreakers } from '../services/aiService';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/search', authMiddleware, async (req, res) => {
  const { name } = req.query;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Name parameter is required' });
  }

  try {
    const linkedInData = await searchLinkedInProfile(name);
    const traits = await analyzeTraits(linkedInData.summary);
    const iceBreakers = await generateIceBreakers(linkedInData);
    
    const profileData = {
      ...linkedInData,
      traits,
      iceBreakers
    };
    
    res.json(profileData);
  } catch (error) {
    console.error('Error in profile search:', error);
    res.status(500).json({ error: 'Failed to retrieve profile data' });
  }
});

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
    res.status(400).json({ error: 'Unable to retrieve user profile' });
  }
});

export default router;