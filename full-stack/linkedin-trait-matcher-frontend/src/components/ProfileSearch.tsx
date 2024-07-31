'use client'

import { useState } from 'react'
import { Box, Button, Input, VStack, Text, Heading } from '@chakra-ui/react'
import { searchProfile } from '@/lib/api'

export default function ProfileSearch() {
  const [url, setUrl] = useState('')
  const [profile, setProfile] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    try {
      const data = await searchProfile(url)
      setProfile(data)
      setError('')
    } catch (err) {
      setError('Failed to fetch profile')
      setProfile(null)
    }
  }

  return (
    <VStack spacing={4} align="stretch">
      <Input 
        placeholder="Enter LinkedIn Profile URL" 
        value={url} 
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button onClick={handleSearch} colorScheme="blue">Search Profile</Button>
      
      {error && <Text color="red.500">{error}</Text>}
      
      {profile && (
        <Box borderWidth={1} borderRadius="lg" padding={4}>
          <Heading as="h2" size="lg">{profile.name}</Heading>
          <Text>{profile.headline}</Text>
          <Text mt={2}>{profile.summary}</Text>
          
          <Heading as="h3" size="md" mt={4}>Key Traits</Heading>
{profile.traits && profile.traits.length > 0 ? (
  <VStack align="start">
    {profile.traits.map((trait, index) => (
      <Text key={index}>• {trait}</Text>
    ))}
  </VStack>
) : (
  <Text>No traits available</Text>
)}
          
          <Heading as="h3" size="md" mt={4}>Ice Breakers</Heading>
          {profile.iceBreakers.map((iceBreaker: string, index: number) => (
            <Text key={index}>{iceBreaker}</Text>
          ))}
        </Box>
      )}
    </VStack>
  )
}