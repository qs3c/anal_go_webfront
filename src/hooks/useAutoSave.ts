import { useEffect, useRef } from 'react'
import { storage } from '../utils/storage'

export function useAutoSave<T>(key: string, data: T, delay = 800) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!key) return
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      storage.set(key, data)
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [key, data, delay])
}

export function loadAutoSave<T>(key: string): T | null {
  if (!key) return null
  return storage.get<T>(key, null)
}
