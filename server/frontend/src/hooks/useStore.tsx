import { StateUpdater, useEffect, useState } from 'preact/hooks'

export function useStore<T = any>(key: string, defaultValue: any): [T, StateUpdater<T>] {
  const [value, setValue] = useState<T>(() => {
    // Load saved value
    let prevValue = localStorage.getItem(key)
    console.log(key, prevValue, defaultValue)
    return prevValue !== null ? (JSON.parse(prevValue) as T) : defaultValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
