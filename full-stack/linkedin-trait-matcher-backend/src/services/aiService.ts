import { HfInference } from '@huggingface/inference';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openaiConfig);

export async function analyzeTraits(text: string) {
  try {
    const allTraits = [
      "Innovative", "Team Player", "Tech-savvy", "Problem Solver", 
      "Ambitious", "Adaptable", "Continuous Learner", "Leadership",
      "Analytical", "Creative", "Communication", "Detail-oriented",
      "Strategic Thinker", "Results-Driven", "Collaborative"
    ];

    const chunkSize = 10;
    let allResults = [];

    console.log('Starting analyzeTraits with text:', text);

    for (let i = 0; i < allTraits.length; i += chunkSize) {
      const traitChunk = allTraits.slice(i, i + chunkSize);
      const result = await hf.zeroShotClassification({
        model: 'facebook/bart-large-mnli',
        inputs: text,
        parameters: {
          candidate_labels: traitChunk
        }
      });

      console.log('Zero-Shot Classification Result for traits:', result);

      if (result && result.labels && result.scores) {
        allResults = allResults.concat(
          result.labels.map((label, index) => ({
            name: label,
            score: result.scores[index]
          }))
        );
      } else {
        console.error('Unexpected result structure for traits:', result);
      }
    }

    const topTraits = allResults
      .sort((a, b) => b.score - a.score)
      .slice(0, 7)
      .map(trait => trait.name);

    console.log('Top Traits:', topTraits);

    return topTraits;
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

    const iceBreakers = response.data.choices[0].message.content.split('\n').filter(Boolean);
    console.log('Generated Ice Breakers:', iceBreakers);

    return iceBreakers;
  } catch (error) {
    console.error('Error generating ice breakers:', error.response ? error.response.data : error.message);
    throw new Error('Failed to generate ice breakers');
  }
}

export async function generateTechSkills(text: string) {
  try {
    const commonTechSkills = [
      "Java", "JavaScript", "Python", "C++", "C#", "Ruby", "PHP", "Swift",
      "Kotlin", "Go", "Rust", "TypeScript", "SQL", "HTML", "CSS", "React",
      "Angular", "Vue.js", "Node.js", "Django", "Flask", "Spring", "Docker",
      "Kubernetes", "AWS", "Azure", "GCP", "Git", "Jenkins", "TensorFlow",
      "PyTorch", "Scala", "R", "MATLAB", "Tableau", "Power BI", "MongoDB",
      "PostgreSQL", "Redis", "Elasticsearch", "Hadoop", "Spark"
    ];

    const chunkSize = 10;
    let allResults = [];

    console.log('Starting generateTechSkills with text:', text);

    for (let i = 0; i < commonTechSkills.length; i += chunkSize) {
      const skillChunk = commonTechSkills.slice(i, i + chunkSize);
      const result = await hf.zeroShotClassification({
        model: 'facebook/bart-large-mnli',
        inputs: text,
        parameters: {
          candidate_labels: skillChunk
        }
      });

      console.log('Zero-Shot Classification Result for tech skills:', result);

      if (result && result.labels && result.scores) {
        allResults = allResults.concat(
          result.labels.map((label, index) => ({
            name: label,
            score: result.scores[index]
          }))
        );
      } else {
        console.error('Unexpected result structure for tech skills:', result);
      }
    }

    const techSkills = allResults
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(skill => skill.name);

    console.log('Top Tech Skills:', techSkills);

    return techSkills;
  } catch (error) {
    console.error('Error generating tech skills:', error);
    throw new Error('Failed to generate tech skills');
  }
}

export async function generateJobContributions(profile: any) {
  const prompt = `Generate 3 job contributions and achievements based on this LinkedIn profile. The contributions should highlight key accomplishments, skills, and impacts. Profile: ${JSON.stringify(profile)}`;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const contributions = response.data.choices[0].message.content.split('\n').filter(Boolean);
    console.log('Generated Job Contributions:', contributions);

    return contributions;
  } catch (error) {
    console.error('Error generating job contributions:', error.response ? error.response.data : error.message);
    throw new Error('Failed to generate job contributions');
  }
}
