'use client'

import { useState, useEffect } from 'react'
import { Box, VStack, Heading, Text } from '@chakra-ui/react'
import { getMatches } from '@/lib/api'

export default function Matches() {
  const [matches, setMatches] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await getMatches()
        setMatches(data)
      } catch (err) {
        setError('Failed to fetch matches')
      }
    }

    fetchMatches()
  }, [])

  return (
    <Box maxWidth="800px" margin="auto" padding={8}>
      <Heading as="h1" mb={8}>Your Matches</Heading>
      
      {error && <Text color="red.500">{error}</Text>}
      
      <VStack spacing={4} align="stretch">
        {matches.map((match: any) => (
          <Box key={match.matchedUserId} borderWidth={1} borderRadius="lg" padding={4}>
            <Heading as="h2" size="md">Match Score: {match.compatibilityScore.toFixed(2)}%</Heading>
            <Text>Trait Match: {JSON.stringify(match.traitMatch)}</Text>
            <Text>Experience Match: {JSON.stringify(match.experienceMatch)}</Text>
            <Text>Project Match: {JSON.stringify(match.projectMatch)}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  )
}