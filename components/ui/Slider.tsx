import { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Slider({ label, className, ...props }: Props) {
  return (
    <label className="flex flex-col gap-1 w-full">
      {label && <span className="text-xs text-white/50">{label}</span>}
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        className={cn(
          'w-full h-1 rounded-full appearance-none cursor-pointer',
          'bg-white/20 accent-white',
          className,
        )}
        {...props}
      />
    </label>
  )
}
