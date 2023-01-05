import { StateUpdater, useEffect, useState } from 'preact/hooks'

/**
 * A hook that reads a given key from localStorage and updates it when the value changes.
 * @param key The store key
 * @param defaultValue Sets the initial state if no value exists
 * @returns
 */
export function useStore<T = any>(key: string, defaultValue: any): [T, StateUpdater<T>] {
  const [value, setValue] = useState<T>(() => {
    // Load saved value
    let prevValue = localStorage.getItem(key)
    // console.log(key, prevValue, defaultValue)
    return prevValue !== null ? (JSON.parse(prevValue) as T) : defaultValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
