import express from 'express';
import { authMiddleware } from '../middlewares/auth';
import { getLinkedInProfile } from '../services/proxycurlService';
import { analyzeTraits, generateIceBreakers } from '../services/aiService';

const router = express.Router();

router.get('/search', authMiddleware, async (req, res) => {
  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'LinkedIn profile URL is required' });
  }

  try {
    const linkedInData = await getLinkedInProfile(url);
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

export default router;