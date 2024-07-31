const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function searchProfile(url: string) {
  const response = await fetch(`${API_URL}/profiles/search?url=${encodeURIComponent(url)}`)
  if (!response.ok) {
    throw new Error('Failed to fetch profile')
  }
  return response.json()
}

export async function getMatches() {
  const response = await fetch(`${API_URL}/users/match`, { method: 'POST' })
  if (!response.ok) {
    throw new Error('Failed to fetch matches')
  }
  return response.json()
}