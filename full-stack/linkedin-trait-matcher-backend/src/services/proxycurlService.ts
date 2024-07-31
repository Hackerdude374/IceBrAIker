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