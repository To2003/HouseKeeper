'use client'

import { useMemo, useState } from 'react'
import { Check, Plus, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { useStore } from '@/components/store'
import { Card, Fab, Segmented } from '@/components/ui/primitives'
import { Sheet, Field, inputCls } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DynIcon } from '@/components/icon-map'
import { formatMoney, formatDueDate, daysUntil } from '@/lib/helpers'
import { lastMonthTotal } from '@/lib/mock-data'
import type { Recurrence, ServiceExpense, ServiceStatus } from '@/lib/types'

const SERVICE_ICONS = ['zap', 'droplet', 'wifi', 'flame', 'phone', 'building', 'cart', 'tv']

export function Servicios(_props: Partial<SectionProps>) {
  const { services, toggleServiceStatus } = useStore()
  const [filter, setFilter] = useState<'todos' | 'pendiente' | 'pagado'>('todos')
  const [addOpen, setAddOpen] = useState(false)
  const [editing, setEditing] = useState<ServiceExpense | null>(null)

  const total = useMemo(() => services.reduce((s, e) => s + e.amount, 0), [services])
  const paid = useMemo(
    () => services.filter((s) => s.status === 'pagado').reduce((s, e) => s + e.amount, 0),
    [services],
  )
  const pending = total - paid
  const diff = total - lastMonthTotal
  const diffPct = Math.round((diff / lastMonthTotal) * 100)

  const filtered = useMemo(() => {
    const list = filter === 'todos' ? services : services.filter((s) => s.status === filter)
    return [...list].sort((a, b) => daysUntil(a.dueDate) - daysUntil(b.dueDate))
  }, [services, filter])

  const pctPaid = total > 0 ? Math.round((paid / total) * 100) : 0

  return (
    <div className="pb-28">
      <header className="px-5 pb-3 pt-2">
        <h1 className="font-serif text-2xl font-semibold">Servicios y gastos</h1>
        <p className="text-sm text-muted-foreground">Julio 2026</p>
      </header>

      <div className="space-y-5 px-5">
        {/* Resumen */}
        <Card className="overflow-hidden p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wallet className="size-4" />
            Total del mes
          </div>
          <p className="mt-1 font-serif text-3xl font-bold">{formatMoney(total)}</p>
          <div className="mt-1 flex items-center gap-1.5 text-sm">
            {diff >= 0 ? (
              <span className="flex items-center gap-1 font-semibold text-destructive">
                <TrendingUp className="size-4" /> +{formatMoney(diff)} ({diffPct}%)
              </span>
            ) : (
              <span className="flex items-center gap-1 font-semibold text-[var(--success)]">
                <TrendingDown className="size-4" /> {formatMoney(diff)} ({diffPct}%)
              </span>
            )}
            <span className="text-muted-foreground">vs. junio</span>
          </div>

          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
              <span className="text-[var(--success)]">Pagado {formatMoney(paid)}</span>
              <span className="text-muted-foreground">Falta {formatMoney(pending)}</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-[var(--success)] transition-all" style={{ width: `${pctPaid}%` }} />
            </div>
          </div>
        </Card>

        <Segmented
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'todos', label: 'Todos' },
            { value: 'pendiente', label: 'Pendientes' },
            { value: 'pagado', label: 'Pagados' },
          ]}
        />

        <div className="space-y-2">
          {filtered.map((svc) => {
            const d = daysUntil(svc.dueDate)
            const overdue = svc.status === 'pendiente' && d < 0
            const soon = svc.status === 'pendiente' && d >= 0 && d <= 3
            return (
              <Card key={svc.id} className="flex items-center gap-3 p-3.5">
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-xl ${
                    svc.status === 'pagado' ? 'bg-muted text-muted-foreground' : 'bg-primary/12 text-primary'
                  }`}
                >
                  <DynIcon name={svc.icon} className="size-5" />
                </span>
                <button className="min-w-0 flex-1 text-left" onClick={() => setEditing(svc)}>
                  <p className="truncate text-sm font-semibold">{svc.category}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {svc.provider} ·{' '}
                    <span className={overdue ? 'font-semibold text-destructive' : soon ? 'font-semibold text-warning-foreground' : ''}>
                      {formatDueDate(svc.dueDate)}
                    </span>
                  </p>
                </button>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-bold">{formatMoney(svc.amount)}</span>
                  <button
                    onClick={() => toggleServiceStatus(svc.id)}
                    className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold transition-colors ${
                      svc.status === 'pagado'
                        ? 'bg-[var(--success)]/15 text-[var(--success)]'
                        : 'bg-muted text-muted-foreground hover:bg-primary/12 hover:text-primary'
                    }`}
                  >
                    {svc.status === 'pagado' ? (
                      <>
                        <Check className="size-3" strokeWidth={3} /> Pagado
                      </>
                    ) : (
                      'Marcar pago'
                    )}
                  </button>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Desglose por categoría */}
        <section>
          <h2 className="mb-2 text-sm font-bold">Desglose del mes</h2>
          <Card className="space-y-3 p-4">
            {[...services]
              .sort((a, b) => b.amount - a.amount)
              .map((svc) => {
                const pct = Math.round((svc.amount / total) * 100)
                return (
                  <div key={svc.id}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-medium">
                        <DynIcon name={svc.icon} className="size-3.5 text-muted-foreground" />
                        {svc.category}
                      </span>
                      <span className="font-semibold text-muted-foreground">{formatMoney(svc.amount)}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary/70" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
          </Card>
        </section>
      </div>

      <Fab label="Gasto" onClick={() => setAddOpen(true)} />
      <ServiceModal open={addOpen} onClose={() => setAddOpen(false)} />
      <ServiceModal open={!!editing} onClose={() => setEditing(null)} editing={editing ?? undefined} />
    </div>
  )
}

function ServiceModal({
  open,
  onClose,
  editing,
}: {
  open: boolean
  onClose: () => void
  editing?: ServiceExpense
}) {
  const { saveService } = useStore()
  const [category, setCategory] = useState(editing?.category ?? '')
  const [provider, setProvider] = useState(editing?.provider ?? '')
  const [amount, setAmount] = useState(editing?.amount ?? 0)
  const [dueDate, setDueDate] = useState(editing?.dueDate ?? '2026-07-31')
  const [icon, setIcon] = useState(editing?.icon ?? 'building')
  const [status, setStatus] = useState<ServiceStatus>(editing?.status ?? 'pendiente')
  const [recurrence, setRecurrence] = useState<Recurrence>(editing?.recurrence ?? 'mensual')

  // sincronizar cuando cambia el registro en edición
  const key = editing?.id ?? 'new'
  useMemo(() => {
    setCategory(editing?.category ?? '')
    setProvider(editing?.provider ?? '')
    setAmount(editing?.amount ?? 0)
    setDueDate(editing?.dueDate ?? '2026-07-31')
    setIcon(editing?.icon ?? 'building')
    setStatus(editing?.status ?? 'pendiente')
    setRecurrence(editing?.recurrence ?? 'mensual')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  function submit() {
    if (!category.trim()) return
    saveService({ id: editing?.id, category: category.trim(), provider: provider.trim(), amount, dueDate, icon, status, recurrence })
    onClose()
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={editing ? 'Editar gasto' : 'Nuevo gasto'}
      footer={
        <Button className="w-full" size="lg" onClick={submit} disabled={!category.trim()}>
          {editing ? 'Guardar cambios' : 'Agregar gasto'}
        </Button>
      }
    >
      <Field label="Categoría">
        <input autoFocus value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ej: Luz, Gas, Netflix…" className={inputCls} />
      </Field>
      <Field label="Proveedor">
        <input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="Ej: Edenor" className={inputCls} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Monto">
          <input type="number" min={0} value={amount} onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))} className={inputCls} />
        </Field>
        <Field label="Vencimiento">
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputCls} />
        </Field>
      </div>

      <Field label="Ícono">
        <div className="flex flex-wrap gap-2">
          {SERVICE_ICONS.map((ic) => (
            <button
              key={ic}
              onClick={() => setIcon(ic)}
              aria-label={ic}
              className={`grid size-11 place-items-center rounded-xl border transition-colors ${
                icon === ic ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
              }`}
            >
              <DynIcon name={ic} className="size-5" />
            </button>
          ))}
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Estado">
          <select value={status} onChange={(e) => setStatus(e.target.value as ServiceStatus)} className={inputCls}>
            <option value="pendiente">Pendiente</option>
            <option value="pagado">Pagado</option>
          </select>
        </Field>
        <Field label="Frecuencia">
          <select value={recurrence} onChange={(e) => setRecurrence(e.target.value as Recurrence)} className={inputCls}>
            <option value="mensual">Mensual</option>
            <option value="unica">Única vez</option>
          </select>
        </Field>
      </div>
    </Sheet>
  )
}
