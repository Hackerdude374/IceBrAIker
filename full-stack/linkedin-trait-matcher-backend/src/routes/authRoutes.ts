import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getAuthorizationUrl, getAccessToken, getLinkedInProfile } from '../services/linkedinService';

const router = express.Router();
const prisma = new PrismaClient();

// LinkedIn OAuth routes
router.get('/linkedin', (req, res) => {
  const authUrl = getAuthorizationUrl();
  res.redirect(authUrl);
});

router.get('/linkedin/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const accessToken = await getAccessToken(code as string);
    const profile = await getLinkedInProfile(accessToken);
    
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
              industry: '',
              location: '',
              summary: '',
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
              jobTitle: profile.headline,
              profilePicture: profile.profilePicture,
            }
          }
        },
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string);
    res.json({ message: 'Authentication successful', token });
  } catch (error) {
    console.error('Authentication failed:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Traditional signup route
router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        profile: {
          create: {
            linkedinUrl: '',
            jobTitle: '',
            industry: '',
            location: '',
            summary: '',
          }
        }
      },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string);
    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    console.error('Signup failed:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string);
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  // Since we're using JWT, we don't need to do anything server-side for logout
  // The client should remove the token from local storage
  res.json({ message: 'Logout successful' });
});

export default router;