import { HfInference } from '@huggingface/inference';
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const llm = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY });

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
  const prompt = PromptTemplate.fromTemplate(
    "Generate 3 unique and engaging ice breakers based on this LinkedIn profile. The ice breakers should be professional, related to their work experience or skills, and encourage meaningful conversation. Profile: {profile}"
  );
  const chain = new LLMChain({ llm, prompt });
  try {
    const result = await chain.call({ profile: JSON.stringify(profile) });
    return result.text.split('\n').filter(Boolean);
  } catch (error) {
    console.error('Error generating ice breakers:', error);
    throw new Error('Failed to generate ice breakers');
  }
}