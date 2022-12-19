import { useEffect, useState } from 'preact/hooks'

export function useStore(key: string, defaultValue: any) {
  const [value, setValue] = useState(() => {
    // Load saved value
    let prevValue = localStorage.getItem(key)
    console.log(key, prevValue, defaultValue)
    return prevValue !== null ? JSON.parse(prevValue) : defaultValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
