import axios from 'axios';
import querystring from 'querystring';

const LINKEDIN_API_URL = 'https://api.linkedin.com/v2';
const LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2';

export const getAuthorizationUrl = () => {
  const params = querystring.stringify({
    response_type: 'code',
    client_id: process.env.LINKEDIN_CLIENT_ID,
    redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
    state: 'random_state_string',
    scope: 'r_liteprofile r_emailaddress',
  });

  return `${LINKEDIN_AUTH_URL}/authorization?${params}`;
};

export const getAccessToken = async (code: string) => {
  const { data } = await axios.post(
    `${LINKEDIN_AUTH_URL}/accessToken`,
    querystring.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return data.access_token;
};

export const getLinkedInProfile = async (accessToken: string) => {
  const { data } = await axios.get(`${LINKEDIN_API_URL}/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~:playableStreams),headline,vanityName)`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const emailData = await axios.get(`${LINKEDIN_API_URL}/emailAddress?q=members&projection=(elements*(handle~))`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  return {
    id: data.id,
    firstName: data.localizedFirstName,
    lastName: data.localizedLastName,
    email: emailData.data.elements[0]['handle~'].emailAddress,
    profilePicture: data.profilePicture?.['displayImage~']?.elements[0]?.identifiers[0]?.identifier,
    headline: data.headline,
    publicProfileUrl: `https://www.linkedin.com/in/${data.vanityName}`
  };
};