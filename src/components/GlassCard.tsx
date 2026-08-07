import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function GlassCard({ children, className = '', onClick }: Props) {
  const base =
    'glass rounded-[22px] ' +
    (onClick ? 'cursor-pointer transition hover:shadow-lg ' : '') +
    className

  if (onClick) {
    return (
      <button type="button" className={`${base} w-full text-left`} onClick={onClick}>
        {children}
      </button>
    )
  }

  return <div className={base}>{children}</div>
}
