import axios from 'axios';

const PROXYCURL_API_URL = 'https://nubela.co/proxycurl/api/v2/linkedin';

export async function getLinkedInProfile(linkedinUrl: string) {
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

export async function searchLinkedInProfileByName(firstName: string, lastName: string) {
  try {
    const response = await axios.get(`${PROXYCURL_API_URL}/search`, {
      params: {
        first_name: firstName,
        last_name: lastName,
      },
      headers: {
        'Authorization': `Bearer ${process.env.PROXYCURL_API_KEY}`
      }
    });

    // The search API might return multiple results, so we'll take the first one
    const profileUrl = response.data.results[0]?.public_identifier;
    if (!profileUrl) {
      throw new Error('No profile found for the given name');
    }

    // Now fetch the full profile using the URL
    return getLinkedInProfileByUrl(`https://www.linkedin.com/in/${profileUrl}/`);
  } catch (error) {
    console.error('Error searching LinkedIn profile by name:', error);
    throw new Error('Failed to find LinkedIn profile');
  }
}
