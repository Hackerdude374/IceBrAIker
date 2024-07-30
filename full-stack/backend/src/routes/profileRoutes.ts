import express from 'express';
import { fetchLinkedInData } from '../services/tavilyService';
import { analyzeTraits, generateIceBreakers } from '../services/aiService';
import { indexProfile } from '../services/ragService';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

router.get('/search', authMiddleware, async (req, res) => {
  const { name } = req.query;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Name parameter is required' });
  }

  try {
    const linkedInData = await fetchLinkedInData(name);
    const traits = await analyzeTraits(linkedInData.summary);
    const iceBreakers = await generateIceBreakers(linkedInData);
    
    const profileData = {
      ...linkedInData,
      traits,
      iceBreakers
    };
    
    // Index the profile in Pinecone
    await indexProfile(profileData);
    
    res.json(profileData);
  } catch (error) {
    console.error('Error in profile search:', error);
    res.status(500).json({ error: 'Failed to retrieve profile data' });
  }
});

export default router;