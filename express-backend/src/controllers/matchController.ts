// src/controllers/matchController.ts
import { Request, Response } from 'express';
import { prisma } from '../server';
import { analyzeProfiles } from '../utils/aiMatchingAnalysis';

interface AuthRequest extends Request {
  userId?: number;
}

export async function findMatches(req: AuthRequest, res: Response) {
  try {
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: req.userId },
      include: { user: true },
    });
    
    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: req.userId },
      include: { user: true },
    });

    const matches = await analyzeProfiles(userProfile, favorites);

    res.json(matches);
  } catch (error) {
    console.error('Error finding matches:', error);
    res.status(500).json({ error: 'Error finding matches' });
  }
}