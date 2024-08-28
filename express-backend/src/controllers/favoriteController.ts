// src/controllers/favoriteController.ts
import { Request, Response } from 'express';
import { prisma } from '../server';
import { analyzeProfile } from '../utils/pythonInterface';

export const addFavorite = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { linkedinUrl } = req.body;
    
    // Analyze the LinkedIn profile
    const profileData = await analyzeProfile(linkedinUrl);
    
    const favorite = await prisma.favorite.create({
      data: {
        userId,
        linkedinUrl,
        profileData: JSON.stringify(profileData),
      },
    });
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ error: 'Error adding favorite' });
  }
};

export const removeFavorite = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    await prisma.favorite.deleteMany({
      where: {
        id: parseInt(id),
        userId,
      },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error removing favorite' });
  }
};

export const getFavorites = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const favorites = await prisma.favorite.findMany({
      where: { userId },
    });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching favorites' });
  }
};
