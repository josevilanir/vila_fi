import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'icon'
  children: ReactNode
}

export function Button({ variant = 'primary', className, children, ...props }: Props) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:opacity-50',
        variant === 'primary' && 'bg-white/20 hover:bg-white/30 px-4 py-2 text-sm text-white backdrop-blur-sm',
        variant === 'ghost'   && 'text-white/70 hover:text-white px-3 py-1.5 text-sm',
        variant === 'icon'    && 'w-10 h-10 text-white/80 hover:text-white hover:bg-white/10',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
