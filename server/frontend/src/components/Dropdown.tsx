import { useEffect, useRef, useState } from 'preact/hooks'
import './dropdown.scss'

export function Dropdown({ children, target, css, modal }: any) {
  const [isOpen, setOpen] = useState(false)
  const element = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!modal && isOpen) {
      document.addEventListener('click', (e: MouseEvent) => {
        let eventPath = e.composedPath()
        if (!eventPath.includes(element.current!)) {
          setOpen(false)
        }
      })
    }
  }, [isOpen, setOpen])

  return (
    <div
      ref={element}
      class={`dropdown-element ${css}`}
      onClick={(e) => {
        setOpen(!isOpen)
      }}>
      {target}
      <div
        class='dropdown-details drop-shadow-4'
        aria-hidden={!isOpen}
        onClick={(e) => {
          if (modal) e.stopPropagation()
        }}>
        {children}
      </div>
    </div>
  )
}
