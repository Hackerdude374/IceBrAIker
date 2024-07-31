import { HfInference } from '@huggingface/inference';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openaiConfig);
dotenv.config();
export async function analyzeTraits(text: string) {
  try {
    const result = await hf.textClassification({
      model: 'SkolkovoInstitute/russian_toxicity_classifier',
      inputs: text,
    });
    return result;
  } catch (error) {
    console.error('Error analyzing traits:', error);
    throw new Error('Failed to analyze traits');
  }
}

export async function generateIceBreakers(profile: any) {
  const prompt = `Generate 3 unique and engaging ice breakers based on this LinkedIn profile. The ice breakers should be professional, related to their work experience or skills, and encourage meaningful conversation. Profile: ${JSON.stringify(profile)}`;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    return response.data.choices[0].message.content.split('\n').filter(Boolean);
  } catch (error) {
    console.error('Error generating ice breakers:', error);
    throw new Error('Failed to generate ice breakers');
  }
}