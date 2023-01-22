import { debounce, Function } from 'atomic-fns'
import { useCallback } from 'preact/hooks'

export function useDebounced(cb: Function, timeout: number) {
  return useCallback(debounce(cb, timeout), [cb, timeout])
}
