import { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ className, children, ...props }: Props) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 p-4',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
