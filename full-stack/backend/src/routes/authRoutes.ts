import express from 'express';
import { linkedinAuth, getLinkedInProfile } from '../services/linkedinService';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/linkedin', (req, res) => {
  const authUrl = linkedinAuth.getAuthorizationUrl();
  res.redirect(authUrl);
});

router.get('/linkedin/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { accessToken, profile } = await linkedinAuth.getUserProfile(code as string);
    
    let user = await prisma.user.findUnique({ where: { linkedinId: profile.id } });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          linkedinId: profile.id,
          email: profile.email,
          name: `${profile.firstName} ${profile.lastName}`,
          accessToken,
          profilePicture: profile.profilePicture,
          profile: {
            create: {
              linkedinUrl: profile.publicProfileUrl,
              jobTitle: profile.headline,
              industry: profile.industry,
              location: profile.location.name,
              summary: profile.summary,
              profilePicture: profile.profilePicture,
            }
          }
        },
      });
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          accessToken,
          profilePicture: profile.profilePicture,
          profile: {
            update: {
              profilePicture: profile.profilePicture,
            }
          }
        },
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string);
    res.json({ message: 'Authentication successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
});

export default router;