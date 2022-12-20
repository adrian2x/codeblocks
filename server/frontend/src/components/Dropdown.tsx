import { useEffect, useState } from 'preact/hooks'
import './dropdown.scss'

export function Dropdown({ children, target, css }: any) {
  const [isOpen, setOpen] = useState(false)
  return (
    <div class={`dropdown-element ${css}`} onClick={(e) => setOpen(!isOpen)}>
      {target}
      <div
        class='dropdown-details drop-shadow-4'
        aria-hidden={!isOpen}
        onClick={(e) => {
          e.stopPropagation()
        }}>
        {children}
      </div>
    </div>
  )
}
