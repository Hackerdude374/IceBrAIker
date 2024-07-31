import express from 'express';
import { authMiddleware } from '../middlewares/auth';
import { getLinkedInProfile } from '../services/proxycurlService';
import { analyzeTraits, generateIceBreakers } from '../services/aiService';
import { getLinkedInProfileByUrl, searchLinkedInProfileByName } from '../services/proxycurlService';
const router = express.Router();

// router.get('/search',  async (req, res) => {
//   const { url } = req.query;
//   if (!url || typeof url !== 'string') {
//     return res.status(400).json({ error: 'LinkedIn profile URL is required' });
//   }

//   try {
//     const linkedInData = await getLinkedInProfile(url);
//     const traits = await analyzeTraits(linkedInData.summary);
//  //   const iceBreakers = await generateIceBreakers(linkedInData);
    
//     const profileData = {
//       ...linkedInData,
//       traits,
//   //    iceBreakers
//     }; 
    
//     res.json(profileData);
//   } catch (error) {
//     console.error('Error in profile search:', error);
//     res.status(500).json({ error: 'Failed to retrieve profile data' });
//   }
// });
router.get('/search', async (req, res) => {
  const { url, firstName, lastName } = req.query;

  if (!url && (!firstName || !lastName)) {
    return res.status(400).json({ error: 'Either URL or both first name and last name are required' });
  }

  try {
    let linkedInData;
    if (url && typeof url === 'string') {
      linkedInData = await getLinkedInProfileByUrl(url);
    } else if (firstName && lastName && typeof firstName === 'string' && typeof lastName === 'string') {
      linkedInData = await searchLinkedInProfileByName(firstName, lastName);
    } else {
      throw new Error('Invalid search parameters');
    }

    const traits = await analyzeTraits(linkedInData.summary);
    
    let iceBreakers = [];
    try {
      iceBreakers = await generateIceBreakers(linkedInData);
    } catch (iceBreakersError) {
      console.error('Failed to generate ice breakers:', iceBreakersError);
    }
    
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