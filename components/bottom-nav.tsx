'use client'

import { Home, Package, ShoppingCart, ChefHat, Receipt } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TabKey = 'inicio' | 'inventario' | 'compras' | 'recetero' | 'servicios' | 'perfil'

const tabs: { key: TabKey; label: string; icon: typeof Home }[] = [
  { key: 'inicio', label: 'Inicio', icon: Home },
  { key: 'inventario', label: 'Inventario', icon: Package },
  { key: 'compras', label: 'Compras', icon: ShoppingCart },
  { key: 'recetero', label: 'Recetero', icon: ChefHat },
  { key: 'servicios', label: 'Servicios', icon: Receipt },
]

export function BottomNav({
  active,
  onChange,
  badges,
}: {
  active: TabKey
  onChange: (t: TabKey) => void
  badges?: Partial<Record<TabKey, number>>
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-border bg-card/95 backdrop-blur-md">
      <ul className="flex items-stretch justify-around px-1 pb-[env(safe-area-inset-bottom)] pt-1.5">
        {tabs.map(({ key, label, icon: Icon }) => {
          const isActive = active === key
          const count = badges?.[key]
          return (
            <li key={key} className="flex-1">
              <button
                onClick={() => onChange(key)}
                aria-current={isActive ? 'page' : undefined}
                className="relative flex w-full flex-col items-center gap-0.5 rounded-xl py-1.5"
              >
                <span
                  className={cn(
                    'relative grid h-8 w-14 place-items-center rounded-full transition-colors',
                    isActive ? 'bg-primary/12 text-primary' : 'text-muted-foreground',
                  )}
                >
                  <Icon className="size-5" strokeWidth={isActive ? 2.5 : 2} />
                  {count ? (
                    <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-bold text-danger-foreground">
                      {count}
                    </span>
                  ) : null}
                </span>
                <span className={cn('text-[11px] font-semibold', isActive ? 'text-primary' : 'text-muted-foreground')}>
                  {label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
