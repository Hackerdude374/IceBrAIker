import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { generateUserProfile, scrapeLinkedInProfile } from '../services/profileGenerationService';

const prisma = new PrismaClient();

export const handleOptions = (req: Request, res: Response) => {
  res.sendStatus(200);
};

export async function register(req: Request, res: Response) {
  console.log('Register request body:', req.body); // Debug log
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string);
    console.log('User registered successfully:', user.id); // Debug log
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
}



export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
}

export async function linkedinCallback(req: Request, res: Response) {
  const { user } = req;
  if (!user) {
    return res.status(401).json({ error: 'Authentication failed' });
  }

  try {
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string);
    
    // If it's a new user, generate their profile
    if (user.createdAt === user.updatedAt) {
      const linkedinData = await scrapeLinkedInProfile(user.linkedinUrl);
      await generateUserProfile(user.id, linkedinData);
    }

    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('Error in LinkedIn callback:', error);
    res.status(500).json({ error: 'Error processing LinkedIn login' });
  }
}

export async function logout(req: Request, res: Response) {
  // For JWT, we don't need to do anything on the server side
  // The client should remove the token from storage
  res.json({ message: 'Logged out successfully' });
}