import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';
import { HfInference } from '@huggingface/inference';

dotenv.config();

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openaiConfig);

async function retryAsyncFunction(asyncFn: Function, args: any[], retries: number): Promise<any> {
  let attempts = 0;
  while (attempts < retries) {
    try {
      return await asyncFn(...args);
    } catch (error) {
      attempts++;
      console.error(`Attempt ${attempts} failed:`, error);
      if (attempts >= retries) {
        throw error;
      }
      await new Promise(res => setTimeout(res, 1000)); // Delay between retries
    }
  }
}

function extractTextFromSections(profile: any, sections: string[]): string {
  let text = '';

  if (sections.includes('bio') && profile.summary) {
    text += profile.summary + ' ';
  }

  if (sections.includes('projects') && profile.projects) {
    profile.projects.forEach((project: any) => {
      if (project.description) {
        text += project.description + ' ';
      }
    });
  }

  if (sections.includes('experience') && profile.experiences) {
    profile.experiences.forEach((experience: any) => {
      if (experience.description) {
        text += experience.description + ' ';
      }
    });
  }

  if (sections.includes('skills') && profile.skills) {
    text += profile.skills.join(' ') + ' ';
  }

  return text.trim();
}

export async function analyzeTraits(profile: any) {
  try {
    const text = extractTextFromSections(profile, ['bio', 'projects', 'experience']);
    console.log('Starting analyzeTraits with text:', text);

    const prompt = `Analyze the following text(the linkedin bio, projects, and experience) and list the top 7 traits that describe the person professionally: ${text}`;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const traits = response.data.choices[0].message.content.split('\n').filter(Boolean);
    console.log('Generated Traits:', traits);

    return traits;
  } catch (error) {
    console.error('Error analyzing traits:', error.response ? error.response.data : error.message);
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

    const iceBreakers = response.data.choices[0].message.content.split('\n').filter(Boolean);
    console.log('Generated Ice Breakers:', iceBreakers);

    return iceBreakers;
  } catch (error) {
    console.error('Error generating ice breakers:', error.response ? error.response.data : error.message);
    throw new Error('Failed to generate ice breakers');
  }
}

export async function generateTechSkills(profile: any) {
  try {
    const text = extractTextFromSections(profile, ['bio', 'projects', 'experience']);
    console.log('Starting generateTechSkills with text:', text);

    const prompt = `Analyze the following text (the linkedin skills, projects, and experience) and list the top 10 technical skills that the person possesses: ${text}`;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const techSkills = response.data.choices[0].message.content.split('\n').filter(Boolean);
    console.log('Generated Tech Skills:', techSkills);

    // Optional: Enhance the tech skills with Hugging Face emotion analysis
    const enhancedSkills = await enhanceSkillsWithEmotionAnalysis(techSkills);
    console.log('Enhanced Tech Skills:', enhancedSkills);

    return enhancedSkills;
  } catch (error) {
    console.error('Error generating tech skills:', error.response ? error.response.data : error.message);
    throw new Error('Failed to generate tech skills');
  }
}

async function enhanceSkillsWithEmotionAnalysis(skills: string[]): Promise<string[]> {
  try {
    const enhancedSkills = [];
    for (const skill of skills) {
      const result = await hf.sentiment({
        model: 'distilbert-base-uncased-finetuned-sst-2-english',
        inputs: skill,
      });
      console.log('Emotion Analysis Result for skill:', skill, result);
      enhancedSkills.push(`${skill} (${result[0].label}: ${result[0].score.toFixed(2)})`);
    }
    return enhancedSkills;
  } catch (error) {
    console.error('Error enhancing skills with emotion analysis:', error);
    return skills; // Return the original skills if enhancement fails
  }
}

export async function generateJobContributions(profile: any) {
  try {
    const prompt = `Generate 3 significant job contributions based on this LinkedIn profile. The contributions should highlight the impact and achievements in their roles. Profile: ${JSON.stringify(profile)}`;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const jobContributions = response.data.choices[0].message.content.split('\n').filter(Boolean);
    console.log('Generated Job Contributions:', jobContributions);

    return jobContributions;
  } catch (error) {
    console.error('Error generating job contributions:', error.response ? error.response.data : error.message);
    throw new Error('Failed to generate job contributions');
  }
}
