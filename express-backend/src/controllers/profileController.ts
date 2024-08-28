import { Request, Response } from 'express';
import { prisma } from '../server';
import { analyzeProfile as analyzePythonProfile } from '../utils/pythonInterface';
import { generateUserProfile, scrapeLinkedInProfile } from '../services/profileGenerationService';
interface AuthRequest extends Request {
  userId?: number;
}

export async function analyzeProfile(req: AuthRequest, res: Response) {
  try {
    const { linkedinUrl } = req.body;
    const analysis = await analyzePythonProfile(linkedinUrl);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Error analyzing profile' });
  }
}

export async function favoriteProfile(req: AuthRequest, res: Response) {
  try {
    const { linkedinUrl } = req.body;
    const favorite = await prisma.favorite.create({
      data: {
        userId: req.userId!,
        linkedinUrl,
      },
    });
    res.json(favorite);
  } catch (error) {
    res.status(500).json({ error: 'Error favoriting profile' });
  }
}

export async function getFavorites(req: AuthRequest, res: Response) {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.userId },
    });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching favorites' });
  }
}

export async function getProfile(req: AuthRequest, res: Response) {
  try {
    const profile = await prisma.userProfile.findUnique({
      where: { userId: req.userId },
    });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Error fetching profile' });
  }
}