// src/services/ragService.ts

import { PineconeClient } from "@pinecone-database/pinecone";
import { Configuration, OpenAIApi } from "openai";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

let pinecone: PineconeClient | null = null;

async function initPinecone() {
  if (!pinecone) {
    pinecone = new PineconeClient();
    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT!,
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }
  return pinecone;
}

async function generateEmbedding(text: string) {
  const response = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: text,
  });
  return response.data.data[0].embedding;
}

export async function indexProfile(profile: any) {
  const pinecone = await initPinecone();
  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

  const profileText = `${profile.name} ${profile.headline} ${profile.summary}`;
  const embedding = await generateEmbedding(profileText);

  await index.upsert([
    {
      id: profile.linkedinId,
      values: embedding,
      metadata: { profileId: profile.id }
    }
  ]);
}

export async function searchSimilarProfiles(profileId: number, topK: number = 5) {
  const pinecone = await initPinecone();
  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    include: { user: true }
  });

  if (!profile) throw new Error("Profile not found");

  const profileText = `${profile.user.name} ${profile.jobTitle} ${profile.summary}`;
  const queryEmbedding = await generateEmbedding(profileText);

  const queryResult = await index.query({
    queryRequest: {
      topK,
      vector: queryEmbedding,
      includeMetadata: true
    }
  });

  return queryResult.matches?.map(match => match.metadata?.profileId);
}