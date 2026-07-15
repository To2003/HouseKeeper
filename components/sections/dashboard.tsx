'use client'

import { CalendarClock, PackageX, TrendingUp, Wallet, ChevronRight, ChefHat, Receipt, Package, ShoppingCart } from 'lucide-react'
import type { SectionProps } from '@/components/app-shell'
import { useStore } from '@/components/store'
import { Card, Avatar } from '@/components/ui/primitives'
import { expiryState, isLowStock, formatMoney, formatDueDate, daysUntil, timeAgo } from '@/lib/helpers'

export function Dashboard({ navigate }: SectionProps) {
  const { inventory, services, activity, members, currentUser } = useStore()

  const porVencer = inventory.filter((i) => {
    const s = expiryState(i)
    return s === 'pronto' || s === 'vencido'
  })
  const stockBajo = inventory.filter(isLowStock)
  const gastoMes = services.reduce((acc, s) => acc + s.amount, 0)
  const proximoPago = services
    .filter((s) => s.status === 'pendiente')
    .sort((a, b) => daysUntil(a.dueDate) - daysUntil(b.dueDate))[0]

  const memberById = (id: string) => members.find((m) => m.id === id)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-muted-foreground">Hola, {currentUser?.name}</p>
        <h2 className="font-serif text-2xl font-bold leading-tight text-balance">
          Esto es lo que pasa en tu hogar hoy
        </h2>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-2 gap-3">
        <SummaryCard
          onClick={() => navigate('inventario')}
          icon={<CalendarClock className="size-5" />}
          tone="warning"
          value={String(porVencer.length)}
          label="Por vencer"
          hint={porVencer[0] ? porVencer[0].name : 'Todo en fecha'}
        />
        <SummaryCard
          onClick={() => navigate('compras')}
          icon={<PackageX className="size-5" />}
          tone="danger"
          value={String(stockBajo.length)}
          label="Stock bajo"
          hint={stockBajo[0] ? stockBajo[0].name : 'Stock completo'}
        />
        <SummaryCard
          onClick={() => navigate('servicios')}
          icon={<TrendingUp className="size-5" />}
          tone="primary"
          value={formatMoney(gastoMes)}
          label="Gasto del mes"
          hint="Julio 2026"
          wide
        />
        <SummaryCard
          onClick={() => navigate('servicios')}
          icon={<Wallet className="size-5" />}
          tone="info"
          value={proximoPago ? formatMoney(proximoPago.amount) : '—'}
          label="Próximo pago"
          hint={proximoPago ? `${proximoPago.category} · ${formatDueDate(proximoPago.dueDate)}` : 'Sin pendientes'}
          wide
        />
      </div>

      {/* Accesos rápidos */}
      <section>
        <h3 className="mb-3 font-semibold">Accesos rápidos</h3>
        <div className="grid grid-cols-4 gap-2">
          <QuickAccess label="Inventario" icon={<Package className="size-6" />} onClick={() => navigate('inventario')} />
          <QuickAccess label="Compras" icon={<ShoppingCart className="size-6" />} onClick={() => navigate('compras')} />
          <QuickAccess label="Recetas" icon={<ChefHat className="size-6" />} onClick={() => navigate('recetero')} />
          <QuickAccess label="Servicios" icon={<Receipt className="size-6" />} onClick={() => navigate('servicios')} />
        </div>
      </section>

      {/* Actividad reciente */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">Actividad reciente</h3>
          <span className="text-xs font-medium text-muted-foreground">Del hogar</span>
        </div>
        <Card className="divide-y divide-border">
          {activity.slice(0, 5).map((a) => {
            const m = memberById(a.memberId)
            return (
              <div key={a.id} className="flex items-center gap-3 p-3.5">
                {m ? <Avatar initials={m.initials} color={m.color} size={34} /> : null}
                <p className="flex-1 text-sm leading-snug">
                  <span className="font-semibold">{m?.name}</span> <span className="text-muted-foreground">{a.text}</span>
                </p>
                <span className="shrink-0 text-xs text-muted-foreground capitalize">{timeAgo(a.timestamp)}</span>
              </div>
            )
          })}
        </Card>
      </section>
    </div>
  )
}

function SummaryCard({
  icon,
  tone,
  value,
  label,
  hint,
  wide,
  onClick,
}: {
  icon: React.ReactNode
  tone: 'warning' | 'danger' | 'primary' | 'info'
  value: string
  label: string
  hint: string
  wide?: boolean
  onClick: () => void
}) {
  const toneCls: Record<string, string> = {
    warning: 'bg-warning/20 text-warning-foreground',
    danger: 'bg-danger/12 text-danger',
    primary: 'bg-primary/12 text-primary',
    info: 'bg-info/15 text-info',
  }
  return (
    <button onClick={onClick} className={wide ? 'col-span-2 text-left' : 'text-left'}>
      <Card className="flex h-full flex-col gap-2 p-4 transition-colors active:bg-muted">
        <div className="flex items-center justify-between">
          <span className={`grid size-9 place-items-center rounded-xl ${toneCls[tone]}`}>{icon}</span>
          <ChevronRight className="size-4 text-muted-foreground" />
        </div>
        <div>
          <p className="font-serif text-2xl font-bold leading-none">{value}</p>
          <p className="mt-1 text-sm font-semibold">{label}</p>
          <p className="truncate text-xs text-muted-foreground">{hint}</p>
        </div>
      </Card>
    </button>
  )
}

function QuickAccess({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5">
      <span className="grid size-14 place-items-center rounded-2xl border border-border bg-card text-primary transition-colors active:bg-muted">
        {icon}
      </span>
      <span className="text-xs font-semibold">{label}</span>
    </button>
  )
}
