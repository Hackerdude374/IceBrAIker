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
    const allTraits = [
      "Innovative", "Team Player", "Tech-savvy", "Problem Solver", 
      "Ambitious", "Adaptable", "Continuous Learner", "Leadership",
      "Analytical", "Creative", "Communication", "Detail-oriented",
      "Strategic Thinker", "Results-Driven", "Collaborative"
    ];

    const chunkSize = 10;
    let allResults = [];

    for (let i = 0; i < allTraits.length; i += chunkSize) {
      const traitChunk = allTraits.slice(i, i + chunkSize);
      const result = await hf.zeroShotClassification({
        model: 'facebook/bart-large-mnli',
        inputs: text,
        parameters: {
          candidate_labels: traitChunk
        }
      });

      // Debugging: Log the result to see its structure
      console.log('Result:', result);

      if (result && result.labels && result.scores) {
        allResults = allResults.concat(
          result.labels.map((label, index) => ({
            name: label,
            score: result.scores[index]
          }))
        );
      } else {
        console.error('Unexpected result structure:', result);
      }
    }

    // Sort all results and take top 7
    const topTraits = allResults
      .sort((a, b) => b.score - a.score)
      .slice(0, 7);

    // Return only the trait names
    return topTraits.map(trait => trait.name);
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

    const result = await hf.zeroShotClassification({
      model: 'facebook/bart-large-mnli',
      inputs: text,
      parameters: {
        candidate_labels: commonTechSkills
      }
    });

    // Debugging: Log the result to see its structure
    console.log('Tech Skills Result:', result);

    if (result && result.labels && result.scores) {
      const techSkills = result.labels
        .map((label, index) => ({
          name: label,
          score: result.scores[index]
        }))
        .sort((a, b) => b.score - a.score)
        .filter(skill => skill.score > 0.5) // Adjust this threshold as needed
        .map(skill => skill.name);

      return techSkills;
    } else {
      console.error('Unexpected result structure:', result);
      return [];
    }
  } catch (error) {
    console.error('Error generating tech skills:', error);
    throw new Error('Failed to generate tech skills');
  }
}