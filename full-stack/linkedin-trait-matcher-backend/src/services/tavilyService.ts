import axios from 'axios';

export async function searchLinkedInProfile(name: string) {
  try {
    const response = await axios.get('https://api.tavily.com/search', {
      params: {
        api_key: process.env.TAVILY_API_KEY,
        query: `LinkedIn profile of ${name}`,
        search_depth: 'advanced',
        include_domains: 'linkedin.com',
      },
    });
    
    return processLinkedInData(response.data);
  } catch (error) {
    console.error('Error fetching LinkedIn data:', error);
    throw new Error('Failed to fetch LinkedIn data');
  }
}

function processLinkedInData(tavilyResponse: any) {
  const linkedInResult = tavilyResponse.results.find((result: any) => result.url.includes('linkedin.com/in/'));
  
  if (!linkedInResult) {
    throw new Error('LinkedIn profile not found');
  }

  return {
    name: linkedInResult.title.split(' | ')[0],
    headline: linkedInResult.title.split(' | ')[1],
    summary: linkedInResult.snippet,
    profileUrl: linkedInResult.url,
  };
}