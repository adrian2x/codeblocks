import { clsx } from 'clsx'
import { ReactNode, useState } from 'react'
import './tabs.scss'

export interface TabProps {
  current?: string
  isFull?: boolean
  children: ReactNode
  onChange?: (current: string) => any
}

export function Tabs({ current, isFull, children, onChange }: TabProps) {
  const [active, setActive] = useState(current)

  return (
    <div className={clsx('tabs', { 'is-full': isFull })}>
      {children.map((node: any) => (
        <a
          className={clsx({ active: node.props.id === active })}
          onClick={(e) => {
            let current: string = node.props.id
            setActive(current)
            onChange?.(current)
          }}>
          {node}
        </a>
      ))}
    </div>
  )
}
