// src/services/profileGenerationService.ts

import { HfInference } from '@huggingface/inference';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { LLMChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain/prompts';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const llm = new ChatOpenAI({ temperature: 0 });

export async function generateUserProfile(userId: number, linkedinData: any) {
  try {
    const summary = await generateSummary(linkedinData);
    const facts = await generateInterestingFacts(linkedinData);
    const iceBreakers = await generateIceBreakers(linkedinData);
    const interests = await generateInterests(linkedinData);
    const { personalityTraits, technicalSkills } = await analyzeTraitsAndSkills(linkedinData);

    await prisma.userProfile.upsert({
      where: { userId },
      update: {
        summary,
        skills: technicalSkills,
        interests,
        iceBreakers,
      },
      create: {
        userId,
        summary,
        skills: technicalSkills,
        interests,
        iceBreakers,
      },
    });

    return {
      summary,
      facts,
      iceBreakers,
      interests,
      personalityTraits,
      technicalSkills,
    };
  } catch (error) {
    console.error('Error generating user profile:', error);
    throw error;
  }
}

async function generateSummary(linkedinData: any): Promise<string> {
  const prompt = PromptTemplate.fromTemplate(
    "Given the information about a person from LinkedIn {information}, create a comprehensive professional summary in 3-4 sentences. Focus on their current role, key skills, and major achievements."
  );
  const chain = new LLMChain({ llm, prompt });
  const result = await chain.call({ information: JSON.stringify(linkedinData) });
  return result.text;
}

async function generateInterestingFacts(linkedinData: any): Promise<string[]> {
  const prompt = PromptTemplate.fromTemplate(
    "Given the information about a person from LinkedIn {information}, create three interesting and unique facts about their professional life or achievements. These should be specific and noteworthy."
  );
  const chain = new LLMChain({ llm, prompt });
  const result = await chain.call({ information: JSON.stringify(linkedinData) });
  return result.text.split('\n').filter(Boolean);
}

async function generateIceBreakers(linkedinData: any): Promise<string[]> {
  const prompt = PromptTemplate.fromTemplate(
    "Based on the LinkedIn profile information {information}, create 3 engaging ice breakers or conversation starters. These should be questions or statements that could initiate a meaningful professional conversation with this person."
  );
  const chain = new LLMChain({ llm, prompt });
  const result = await chain.call({ information: JSON.stringify(linkedinData) });
  return result.text.split('\n').filter(Boolean);
}

async function generateInterests(linkedinData: any): Promise<string[]> {
  const prompt = PromptTemplate.fromTemplate(
    "Analyze the LinkedIn profile information {information} and identify 5 professional or personal interests this individual might have. Consider their job roles, industries, educational background, and any mentioned hobbies or volunteer work."
  );
  const chain = new LLMChain({ llm, prompt });
  const result = await chain.call({ information: JSON.stringify(linkedinData) });
  return result.text.split('\n').filter(Boolean);
}

async function analyzeTraitsAndSkills(linkedinData: any): Promise<{ personalityTraits: string[], technicalSkills: string[] }> {
  const text = `${linkedinData.summary} ${linkedinData.experience.map(exp => exp.description).join(' ')} ${linkedinData.skills.join(' ')}`;
  
  const emotionResults = await hf.textClassification({
    model: 'bhadresh-savani/distilbert-base-uncased-emotion',
    inputs: text.substring(0, 500), // Limit text length
  });

  const traits = emotionResults.map(result => result.label);
  const additionalTraits = ["analytical", "detail-oriented", "innovative", "adaptable", "collaborative", "decisive", "proactive", "strategic"];
  const personalityTraits = [...new Set([...traits, ...additionalTraits.slice(0, 4 - traits.length)])].slice(0, 4);

  const technicalSkills = extractSkills(linkedinData);

  return {
    personalityTraits,
    technicalSkills,
  };
}

function extractSkills(linkedinData: any): string[] {
  const skillKeywords = [
    'Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'Machine Learning', 'Data Analysis',
    'Java', 'C++', 'AWS', 'Docker', 'Kubernetes', 'Git', 'Agile', 'Scrum', 'DevOps',
    'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'Big Data', 'Spark', 'Hadoop',
    'Tableau', 'Power BI', 'Excel', 'R', 'Statistical Analysis', 'Data Visualization',
    'REST API', 'GraphQL', 'Microservices', 'CI/CD', 'Test-Driven Development'
  ];

  const mentionedSkills = new Set<string>();
  
  // Check skills section
  linkedinData.skills.forEach((skill: string) => {
    const matchedSkill = skillKeywords.find(keyword => skill.toLowerCase().includes(keyword.toLowerCase()));
    if (matchedSkill) mentionedSkills.add(matchedSkill);
  });

  // Check experience descriptions
  linkedinData.experience.forEach((exp: any) => {
    skillKeywords.forEach(skill => {
      if (exp.description.toLowerCase().includes(skill.toLowerCase())) {
        mentionedSkills.add(skill);
      }
    });
  });

  // If we don't have at least 4 skills, add some based on the profile
  if (mentionedSkills.size < 4) {
    const fullText = JSON.stringify(linkedinData).toLowerCase();
    if (fullText.includes('data') || fullText.includes('analytics')) {
      mentionedSkills.add('Data Analysis');
    }
    if (fullText.includes('software') || fullText.includes('develop')) {
      mentionedSkills.add('Software Development');
    }
    if (fullText.includes('manage') || fullText.includes('lead')) {
      mentionedSkills.add('Project Management');
    }
  }

  return Array.from(mentionedSkills).slice(0, 4);
}

export async function scrapeLinkedInProfile(linkedinUrl: string): Promise<any> {
  const response = await axios.get(`https://nubela.co/proxycurl/api/v2/linkedin`, {
    params: { url: linkedinUrl },
    headers: { 'Authorization': `Bearer ${process.env.PROXYCURL_API_KEY}` }
  });

  const data = response.data;

  // Clean and structure the data
  return {
    name: `${data.first_name} ${data.last_name}`,
    headline: data.headline,
    summary: data.summary,
    industry: data.industry,
    location: `${data.city}, ${data.country}`,
    experience: data.experiences.map((exp: any) => ({
      title: exp.title,
      company: exp.company,
      description: exp.description,
      startDate: exp.starts_at,
      endDate: exp.ends_at
    })),
    education: data.education.map((edu: any) => ({
      school: edu.school,
      degree: edu.degree_name,
      fieldOfStudy: edu.field_of_study,
      startDate: edu.starts_at,
      endDate: edu.ends_at
    })),
    skills: data.skills.map((skill: any) => skill.name),
    languages: data.languages,
    volunteer: data.volunteer_work,
    certifications: data.certifications
  };
}