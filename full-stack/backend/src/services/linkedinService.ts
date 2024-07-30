import { LinkedInClient } from 'linkedin-api-client';

export const linkedinAuth = new LinkedInClient({
  clientId: process.env.LINKEDIN_CLIENT_ID!,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
  redirectUri: process.env.LINKEDIN_REDIRECT_URI!,
});

export async function getLinkedInProfile(accessToken: string) {
  try {
    const profile = await linkedinAuth.getProfile(accessToken);
    return {
      id: profile.id,
      firstName: profile.localizedFirstName,
      lastName: profile.localizedLastName,
      email: profile.emailAddress,
      profilePicture: profile.profilePicture?.['displayImage~']?.elements[0]?.identifiers[0]?.identifier,
      headline: profile.headline,
      industry: profile.industry,
      location: profile.location,
      summary: profile.summary,
      publicProfileUrl: profile.publicProfileUrl
    };
  } catch (error) {
    console.error('Error fetching LinkedIn profile:', error);
    throw new Error('Failed to fetch LinkedIn profile');
  }
}