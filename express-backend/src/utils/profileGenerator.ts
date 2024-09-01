// // src/utils/profileGenerator.ts

// import axios from 'axios';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function generateUserProfile(userId: number, accessToken: string) {
//   try {
//     // Fetch user data from LinkedIn API
//     const { data: userData } = await axios.get('https://api.linkedin.com/v2/me', {
//       headers: { 'Authorization': `Bearer ${accessToken}` }
//     });

//     // Fetch skills data
//     const { data: skillsData } = await axios.get('https://api.linkedin.com/v2/skills', {
//       headers: { 'Authorization': `Bearer ${accessToken}` }
//     });

//     // Process and extract relevant information
//     const summary = userData.summary || '';
//     const skills = skillsData.elements.map((skill: any) => skill.name);
//     const interests = []; // You might need to fetch this from another endpoint or derive it

//     // Generate ice breakers (you can implement your own logic here)
//     const iceBreakers = generateIceBreakers(userData, skillsData);

//     // Create or update UserProfile
//     await prisma.userProfile.upsert({
//       where: { userId },
//       update: {
//         summary,
//         skills,
//         interests,
//         iceBreakers
//       },
//       create: {
//         userId,
//         summary,
//         skills,
//         interests,
//         iceBreakers
//       }
//     });

//   } catch (error) {
//     console.error('Error generating user profile:', error);
//     throw error;
//   }
// }

// function generateIceBreakers(userData: any, skillsData: any): string[] {
//   // Implement your ice breaker generation logic here
//   // This is a placeholder implementation
//   return [
//     `${userData.firstName} has ${skillsData.elements.length} skills listed on LinkedIn.`,
//     `${userData.firstName}'s most recent position is ${userData.positions.values[0].title} at ${userData.positions.values[0].company.name}.`,
//     `Did you know ${userData.firstName} is skilled in ${skillsData.elements[0].name}?`
//   ];
// }