// src/services/matchingService.ts

import { PrismaClient, Profile, Skill, Experience, Project, Trait } from '@prisma/client';
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { searchSimilarProfiles } from './ragService';

const prisma = new PrismaClient();
const llm = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY });

type ProfileWithRelations = Profile & {
  skills: Skill[];
  experiences: Experience[];
  projects: Project[];
  traits: Trait[];
};

export async function matchProfiles(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { 
      profile: {
        include: { 
          skills: true, 
          experiences: true, 
          projects: true, 
          traits: true 
        }
      },
      favorites: {
        include: { 
          user: {
            include: { 
              profile: {
                include: { 
                  skills: true, 
                  experiences: true, 
                  projects: true, 
                  traits: true 
                }
              }
            }
          }
        }
      }
    }
  });

  if (!user || !user.profile) {
    throw new Error('User or profile not found');
  }

  const similarProfileIds = await searchSimilarProfiles(user.profile.id, 20);
  const similarProfiles = await prisma.profile.findMany({
    where: { id: { in: similarProfileIds } },
    include: { 
      skills: true, 
      experiences: true, 
      projects: true, 
      traits: true,
      user: true
    }
  });

  const matches = [];

  for (const profile of similarProfiles) {
    const traitMatch = compareTraits(user.profile, profile);
    const experienceMatch = compareExperiences(user.profile, profile);
    const projectMatch = compareProjects(user.profile, profile);

    const compatibilityScore = calculateOverallCompatibility(traitMatch, experienceMatch, projectMatch);
    
    matches.push({
      userId: user.id,
      matchedUserId: profile.user.id,
      compatibilityScore,
      traitMatch,
      experienceMatch,
      projectMatch
    });
  }

  await prisma.match.createMany({
    data: matches,
    skipDuplicates: true,
  });

  return matches;
}

function compareTraits(profile1: ProfileWithRelations, profile2: ProfileWithRelations) {
  const traitScores: {[key: string]: number} = {};
  const allTraits = new Set([...profile1.traits.map(t => t.name), ...profile2.traits.map(t => t.name)]);

  allTraits.forEach(trait => {
    const trait1 = profile1.traits.find(t => t.name === trait);
    const trait2 = profile2.traits.find(t => t.name === trait);

    if (trait1 && trait2) {
      traitScores[trait] = 1 - Math.abs(trait1.score - trait2.score);
    } else {
      traitScores[trait] = 0;
    }
  });

  const averageTraitScore = Object.values(traitScores).reduce((a, b) => a + b, 0) / allTraits.size;

  return {
    score: averageTraitScore,
    details: traitScores
  };
}

function compareExperiences(profile1: ProfileWithRelations, profile2: ProfileWithRelations) {
  const commonIndustries = profile1.experiences.filter(exp1 => 
    profile2.experiences.some(exp2 => exp1.title.toLowerCase().includes(exp2.title.toLowerCase()))
  ).length;

  const totalIndustries = new Set([
    ...profile1.experiences.map(e => e.title.toLowerCase()),
    ...profile2.experiences.map(e => e.title.toLowerCase())
  ]).size;

  const industriesScore = commonIndustries / totalIndustries;

  const experienceLengthScore = Math.min(profile1.experiences.length, profile2.experiences.length) / 
                                Math.max(profile1.experiences.length, profile2.experiences.length);

  return {
    score: (industriesScore + experienceLengthScore) / 2,
    details: {
      commonIndustries,
      totalIndustries,
      experienceLengthRatio: experienceLengthScore
    }
  };
}

function compareProjects(profile1: ProfileWithRelations, profile2: ProfileWithRelations) {
  const commonTechnologies = profile1.projects.flatMap(p => p.technologies)
    .filter(tech => profile2.projects.flatMap(p => p.technologies).includes(tech));

  const totalTechnologies = new Set([
    ...profile1.projects.flatMap(p => p.technologies),
    ...profile2.projects.flatMap(p => p.technologies)
  ]);

  const technologiesScore = commonTechnologies.length / totalTechnologies.size;

  const projectCountScore = Math.min(profile1.projects.length, profile2.projects.length) / 
                            Math.max(profile1.projects.length, profile2.projects.length);

  return {
    score: (technologiesScore + projectCountScore) / 2,
    details: {
      commonTechnologies: commonTechnologies.length,
      totalTechnologies: totalTechnologies.size,
      projectCountRatio: projectCountScore
    }
  };
}

function calculateOverallCompatibility(
  traitMatch: {score: number},
  experienceMatch: {score: number},
  projectMatch: {score: number}
) {
  const weights = {
    traits: 0.4,
    experiences: 0.3,
    projects: 0.3
  };

  return (
    traitMatch.score * weights.traits +
    experienceMatch.score * weights.experiences +
    projectMatch.score * weights.projects
  ) * 100; // Convert to percentage
}

async function getDetailedCompatibilityExplanation(profile1: ProfileWithRelations, profile2: ProfileWithRelations) {
  const prompt = PromptTemplate.fromTemplate(
    "Compare these two professional profiles and provide a detailed explanation of their compatibility. Consider their traits, experiences, and projects. Profile 1: {profile1}. Profile 2: {profile2}"
  );
  const chain = new LLMChain({ llm, prompt });
  const result = await chain.call({ 
    profile1: JSON.stringify(profile1),
    profile2: JSON.stringify(profile2)
  });
  return result.text;
}