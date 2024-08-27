import { Request, Response } from 'express';
import { prisma } from '../server';

interface AuthRequest extends Request {
  userId?: number;
}

export async function findMatches(req: AuthRequest, res: Response) {
  try {
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: req.userId },
    });
    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    
    const matches = await prisma.userProfile.findMany({
      where: {
        userId: { not: req.userId },
        skills: { hasSome: userProfile.skills },
        interests: { hasSome: userProfile.interests },
      },
    });
    
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: 'Error finding matches' });
  }
}