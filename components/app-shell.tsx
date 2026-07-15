'use client'

import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { BottomNav, type TabKey } from '@/components/bottom-nav'
import { useTheme } from '@/components/theme-provider'
import { useStore } from '@/components/store'
import { Avatar } from '@/components/ui/primitives'
import { urgencyConfig } from '@/lib/helpers'
import { Dashboard } from '@/components/sections/dashboard'
import { Inventario } from '@/components/sections/inventario'
import { Compras } from '@/components/sections/compras'
import { Recetero } from '@/components/sections/recetero'
import { Servicios } from '@/components/sections/servicios'
import { Perfil } from '@/components/sections/perfil'

export interface SectionProps {
  navigate: (t: TabKey) => void
}

export function AppShell() {
  const [tab, setTab] = useState<TabKey>('inicio')
  const { theme, toggle } = useTheme()
  const { members, household, shopping, services, currentUser } = useStore()

  const onlineMembers = members.filter((m) => m.online)
  const pendingBuy = shopping.filter((s) => !s.bought).length
  const pendingBills = services.filter((s) => s.status === 'pendiente').length

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur-md">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Hogar</p>
          <h1 className="truncate font-serif text-base font-bold leading-tight">{household?.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setTab('perfil')} className="flex items-center gap-1.5 rounded-full bg-success/12 py-1 pl-2 pr-2.5 transition-colors hover:bg-success/20">
            <span className="flex -space-x-2">
              {currentUser && <Avatar initials={currentUser.initials} color={currentUser.color} size={22} ring />}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-success">
              Mi Perfil
            </span>
          </button>
          <button
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
            className="grid size-9 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
          >
            {theme === 'dark' ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 pb-28 pt-4">
        {tab === 'inicio' && <Dashboard navigate={setTab} />}
        {tab === 'inventario' && <Inventario navigate={setTab} />}
        {tab === 'compras' && <Compras navigate={setTab} />}
        {tab === 'recetero' && <Recetero navigate={setTab} />}
        {tab === 'servicios' && <Servicios navigate={setTab} />}
        {tab === 'perfil' && <Perfil navigate={setTab} />}
      </main>

      <BottomNav active={tab} onChange={setTab} badges={{ compras: pendingBuy, servicios: pendingBills }} />
    </div>
  )
}

/* Re-export para conveniencia de tipos */
export { urgencyConfig }
