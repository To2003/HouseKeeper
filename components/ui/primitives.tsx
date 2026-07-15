'use client'

import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-2xl border border-border bg-card text-card-foreground', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function Fab({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="fixed bottom-24 right-5 z-30 flex h-14 items-center gap-2 rounded-full bg-primary px-5 text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-95"
    >
      <Plus className="size-5" strokeWidth={2.5} />
      <span className="text-sm font-bold">{label}</span>
    </button>
  )
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex gap-1 rounded-xl bg-muted p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
            value === o.value ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Avatar({
  initials,
  color,
  size = 32,
  ring,
}: {
  initials: string
  color: string
  size?: number
  ring?: boolean
}) {
  return (
    <span
      className={cn(
        'inline-grid shrink-0 place-items-center rounded-full font-bold text-white',
        ring && 'ring-2 ring-card',
      )}
      style={{ backgroundColor: color, width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </span>
  )
}
