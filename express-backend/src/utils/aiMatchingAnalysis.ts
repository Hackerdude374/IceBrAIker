// src/utils/aiMatchingAnalysis.ts
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export const analyzeProfiles = async (userProfile, favorites) => {
  const results = [];
  for (const favorite of favorites) {
    const favoriteData = JSON.parse(favorite.profileData);
    const similarity = await hf.featureExtraction({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      inputs: [userProfile.summary, favoriteData.summary],
    });
    results.push({
      favoriteId: favorite.id,
      similarity: similarity[0][1],
      profileData: favoriteData,
    });
  }
  return results.sort((a, b) => b.similarity - a.similarity);
};