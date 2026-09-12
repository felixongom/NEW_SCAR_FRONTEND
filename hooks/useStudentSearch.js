import { roundOff } from '@/utils'
import { useEffect, useState } from 'react'

export function useStudentSearch(dataArray, searchTerm, delay = 2000) {
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm)
  const [results, setResults] = useState([])

  // Debounce the input term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm.toLowerCase())
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm, delay])

  // Perform the search when the debounced term updates
  useEffect(() => {
    if (!debouncedTerm || !Array.isArray(dataArray)) {
      setResults([])
      return
    }

    const filtered = dataArray.filter(item =>
      item['STUDENT NAME']?.toLowerCase().includes(debouncedTerm) ||
      item['COMM']?.toLowerCase().includes(debouncedTerm) ||
      item['STREAM']?.toLowerCase() ===debouncedTerm ||
      item['SEX']?.toLowerCase() === debouncedTerm ||
      roundOff(item['AVG'],1)>= debouncedTerm
    )

    setResults(filtered)
  }, [debouncedTerm, dataArray])

  return results
}

