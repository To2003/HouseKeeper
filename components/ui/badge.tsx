import { cn } from '@/lib/utils'

type Tone = 'primary' | 'muted' | 'success' | 'warning' | 'danger' | 'info'

const tones: Record<Tone, string> = {
  primary: 'bg-primary/12 text-primary',
  muted: 'bg-muted text-muted-foreground',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/20 text-warning-foreground',
  danger: 'bg-danger/12 text-danger',
  info: 'bg-info/15 text-info',
}

export function Badge({
  tone = 'muted',
  className,
  children,
}: {
  tone?: Tone
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold leading-none',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

/** Punto de color sólido para semáforos de urgencia */
export function Dot({ tone = 'muted', className }: { tone?: Tone; className?: string }) {
  const bg: Record<Tone, string> = {
    primary: 'bg-primary',
    muted: 'bg-muted-foreground',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
    info: 'bg-info',
  }
  return <span className={cn('inline-block size-2 rounded-full', bg[tone], className)} />
}
