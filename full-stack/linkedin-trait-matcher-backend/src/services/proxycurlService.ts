import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

const PROXYCURL_API_URL = 'https://nubela.co/proxycurl/api/v2/linkedin';

export async function getLinkedInProfileByUrl(linkedinUrl: string) {
  try {
    const response = await axios.get(PROXYCURL_API_URL, {
      params: {
        url: linkedinUrl,
      },
      headers: {
        'Authorization': `Bearer ${process.env.PROXYCURL_API_KEY}`
      }
    });

    return processProxyCurlData(response.data);
  } catch (error) {
    console.error('Error fetching LinkedIn data from ProxyCurl:', error);
    throw new Error('Failed to fetch LinkedIn data');
  }
}

function processProxyCurlData(data: any) {
  return {
    name: `${data.first_name} ${data.last_name}`,
    headline: data.headline,
    summary: data.summary,
    profileUrl: data.public_identifier ? `https://www.linkedin.com/in/${data.public_identifier}/` : null,
    location: data.location,
    industry: data.industry,
    experiences: data.experiences?.map((exp: any) => ({
      title: exp.title,
      company: exp.company,
      startDate: exp.starts_at,
      endDate: exp.ends_at,
      description: exp.description,
    })) || [],
    education: data.education?.map((edu: any) => ({
      school: edu.school,
      degree: edu.degree_name,
      fieldOfStudy: edu.field_of_study,
      startDate: edu.starts_at,
      endDate: edu.ends_at,
    })) || [],
    skills: data.skills || [],
    // Add more fields as needed
  };
}

async function getLangchainCore() {
  const langchainCore = await import('@langchain/core');
  return langchainCore;
}

// Step 1: Search LinkedIn Profile by Name
const searchLinkedInProfileByNameStep = {
  run: async (context: any) => {
    const { firstName, lastName } = context.input;
    try {
      const response = await axios.get(`${PROXYCURL_API_URL}/search`, {
        params: {
          first_name: firstName,
          last_name: lastName,
        },
        headers: {
          'Authorization': `Bearer ${process.env.PROXYCURL_API_KEY}`,
        },
      });

      const profileUrl = response.data.results[0]?.public_identifier;
      if (!profileUrl) {
        throw new Error('No profile found for the given name');
      }

      context.output = { profileUrl: `https://www.linkedin.com/in/${profileUrl}/` };
    } catch (error) {
      console.error('Error searching LinkedIn profile by name:', error);
      throw new Error('Failed to find LinkedIn profile');
    }
  },
};

// Step 2: Fetch LinkedIn Profile Data
const fetchLinkedInProfileDataStep = {
  run: async (context: any) => {
    const { profileUrl } = context.output;
    try {
      const response = await axios.get(PROXYCURL_API_URL, {
        params: {
          url: profileUrl,
        },
        headers: {
          'Authorization': `Bearer ${process.env.PROXYCURL_API_KEY}`,
        },
      });

      context.output = processProxyCurlData(response.data);
    } catch (error) {
      console.error('Error fetching LinkedIn data from ProxyCurl:', error);
      throw new Error('Failed to fetch LinkedIn data');
    }
  },
};

// Define the Chain
async function linkedinProfileChain() {
  const { Chain } = await getLangchainCore();
  return new Chain({
    steps: [searchLinkedInProfileByNameStep, fetchLinkedInProfileDataStep],
  });
}

// Function to search LinkedIn profile by name
export async function searchLinkedInProfileByName(firstName: string, lastName: string) {
  try {
    const chain = await linkedinProfileChain();
    const result = await chain.run({
      input: { firstName, lastName },
    });
    return result.output;
  } catch (error) {
    console.error('Error executing LinkedIn profile chain:', error);
    throw new Error('Failed to execute LinkedIn profile chain');
  }
}
