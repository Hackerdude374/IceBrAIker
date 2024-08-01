'use client';
import React, { useState } from 'react';
import { Box, Button, Input, VStack, Text, Heading, Container, Radio, RadioGroup, Stack, List, ListItem } from '@chakra-ui/react';

export default function ProfileSearch() {
  const [searchType, setSearchType] = useState('url');
  const [url, setUrl] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      let searchParams;
      if (searchType === 'url') {
        searchParams = new URLSearchParams({ url });
      } else {
        searchParams = new URLSearchParams({ firstName, lastName });
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/search?${searchParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      console.log('Profile Data:', data);
      setProfile(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setProfile(null);
    }
  };

  return (
    <Container maxW="800px" centerContent>
      <VStack spacing={8} align="stretch" width="100%">
        <Heading as="h1" size="xl" textAlign="center">IceBrAIkers</Heading>
        
        <RadioGroup onChange={setSearchType} value={searchType}>
          <Stack direction="row">
            <Radio value="url">Search by URL</Radio>
            <Radio value="name">Search by Name</Radio>
          </Stack>
        </RadioGroup>
        
        {searchType === 'url' ? (
          <Input
            placeholder="Enter LinkedIn Profile URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        ) : (
          <VStack>
            <Input
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </VStack>
        )}
        
        <Button onClick={handleSearch} colorScheme="blue">Search Profile</Button>
        
        {error && <Text color="red.500">{error}</Text>}
        
        {profile && (
          <Box borderWidth={1} borderRadius="lg" padding={4}>
            <Heading as="h2" size="lg">{profile.name}</Heading>
            <Text>{profile.headline}</Text>
            <Text mt={2}>{profile.summary}</Text>
            
            <Heading as="h3" size="md" mt={4}>Key Professional Traits</Heading>
            {profile.traits && profile.traits.length > 0 ? (
              <List>
                {profile.traits.map((trait: string, index: number) => (
                  <ListItem key={index}>{trait}</ListItem>
                ))}
              </List>
            ) : (
              <Text>No traits available</Text>
            )}
            
            <Heading as="h3" size="md" mt={4}>Tech Skills</Heading>
            {profile.techSkills && profile.techSkills.length > 0 ? (
              <List>
                {profile.techSkills.map((skill: string, index: number) => (
                  <ListItem key={index}>{skill}</ListItem>
                ))}
              </List>
            ) : (
              <Text>No tech skills available</Text>
            )}
            
            <Heading as="h3" size="md" mt={4}>Job Contributions</Heading>
            {profile.jobContributions && profile.jobContributions.length > 0 ? (
              <List>
                {profile.jobContributions.map((contribution: string, index: number) => (
                  <ListItem key={index}>{contribution}</ListItem>
                ))}
              </List>
            ) : (
              <Text>No job contributions available</Text>
            )}
            
            <Heading as="h3" size="md" mt={4}>Ice Breakers</Heading>
            {profile.iceBreakers && profile.iceBreakers.length > 0 ? (
              <List>
                {profile.iceBreakers.map((iceBreaker: string, index: number) => (
                  <ListItem key={index}>{iceBreaker}</ListItem>
                ))}
              </List>
            ) : (
              <Text>No ice breakers available</Text>
            )}
          </Box>
        )}
      </VStack>
    </Container>
  );
}
