import { useState, useEffect } from 'react'
import { Outfit } from '@/types/outfit'

export function useOutfits() {
  const [outfits, setOutfits] = useState<Outfit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadOutfits = async () => {
      try {
        setIsLoading(true)
        const res = await fetch('/api/outfits')
        if (!res.ok) throw new Error('Failed to load outfits')
        const data = await res.json()
        setOutfits(data)
      } catch (err) {
        console.error('Error loading outfits:', err)
        setError(err instanceof Error ? err : new Error('Failed to load outfits'))
      } finally {
        setIsLoading(false)
      }
    }

    loadOutfits()
  }, [])

  return { outfits, isLoading, error }
}