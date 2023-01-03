import { useCallback, useEffect, useRef } from 'react'

function useInfiniteScroll({
  disabled,
  onLoadMore
}: {
  disabled?: boolean
  onLoadMore: () => any
}) {
  const loadMoreRef = useRef(null)

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target.isIntersecting) {
        onLoadMore()
      }
    },
    [onLoadMore]
  )

  useEffect(() => {
    if (disabled) return

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px',
      threshold: 0
    })

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [observerCallback, disabled])

  return loadMoreRef
}

export default useInfiniteScroll
