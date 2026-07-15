'use client'

import { useMemo, useState } from 'react'
import { Plus, Trash2, ShoppingCart, Sparkles, Check } from 'lucide-react'
import { useStore, useLowStock } from '@/components/store'
import { Card, Fab, Avatar } from '@/components/ui/primitives'
import { Sheet, Field, inputCls } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { urgencyConfig, sortShopping, normalize } from '@/lib/helpers'
import type { ShoppingItem, Unit, Urgency } from '@/lib/types'

const UNITS: Unit[] = ['unidades', 'kg', 'g', 'l', 'ml', 'paquetes']
const URGENCIES: Urgency[] = ['urgente', 'alto', 'medio', 'bajo']

export function Compras(_props: Partial<SectionProps>) {
  const { shopping, members, addShoppingItem, toggleBought, setUrgency, deleteShoppingItem, clearBought } = useStore()
  const lowStock = useLowStock()
  const [addOpen, setAddOpen] = useState(false)
  const [restockItem, setRestockItem] = useState<ShoppingItem | null>(null)

  const pending = useMemo(() => sortShopping(shopping.filter((s) => !s.bought)), [shopping])
  const bought = useMemo(() => shopping.filter((s) => s.bought), [shopping])

  // Sugerencias del inventario (bajo stock / agotado) que aún no están en la lista
  const suggestions = useMemo(
    () => lowStock.filter((it) => !shopping.some((s) => normalize(s.name) === normalize(it.name) && !s.bought)),
    [lowStock, shopping],
  )

  return (
    <div className="pb-28">
      <header className="px-5 pb-3 pt-2">
        <h1 className="font-serif text-2xl font-semibold">Compras</h1>
        <p className="text-sm text-muted-foreground">
          {pending.length} {pending.length === 1 ? 'cosa pendiente' : 'cosas pendientes'}
        </p>
      </header>

      <div className="space-y-6 px-5">
        {suggestions.length > 0 && (
          <section>
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <h2 className="text-sm font-bold">Sugerido por tu inventario</h2>
            </div>
            <Card className="divide-y divide-border overflow-hidden">
              {suggestions.map((it) => (
                <div key={it.id} className="flex items-center gap-3 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{it.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Quedan {it.quantity} {it.unit}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 rounded-full text-xs"
                    onClick={() =>
                      addShoppingItem({
                        name: it.name,
                        quantity: it.minStock ? Math.max(it.minStock - it.quantity, 1) : 1,
                        unit: it.unit,
                        urgency: it.quantity === 0 ? 'urgente' : 'alto',
                        source: 'stock',
                      })
                    }
                  >
                    <Plus className="size-3.5" />
                    Agregar
                  </Button>
                </div>
              ))}
            </Card>
          </section>
        )}

        <section>
          <h2 className="mb-2 text-sm font-bold">Por comprar</h2>
          {pending.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-2">
              {pending.map((item) => {
                const by = members.find((m) => m.id === item.addedBy)
                const cfg = urgencyConfig[item.urgency]
                return (
                  <Card key={item.id} className="flex items-center gap-3 p-3">
                    <button
                      onClick={() => toggleBought(item.id)}
                      aria-label={`Marcar ${item.name} como comprado`}
                      className="grid size-7 shrink-0 place-items-center rounded-full border-2 border-muted-foreground/40 transition-colors active:scale-95"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{item.name}</p>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>
                          {item.quantity} {item.unit}
                        </span>
                        {item.source === 'receta' && <span className="text-primary">· de receta</span>}
                        {item.source === 'stock' && <span className="text-primary">· bajo stock</span>}
                      </div>
                    </div>
                    <select
                      value={item.urgency}
                      onChange={(e) => setUrgency(item.id, e.target.value as Urgency)}
                      aria-label="Urgencia"
                      className="rounded-full border-0 bg-transparent p-0 text-xs font-bold outline-none"
                      style={{ color: `var(--${cfg.token === 'danger' ? 'destructive' : cfg.token})` }}
                    >
                      {URGENCIES.map((u) => (
                        <option key={u} value={u}>
                          {urgencyConfig[u].label}
                        </option>
                      ))}
                    </select>
                    {by && <Avatar initials={by.initials} color={by.color} size={26} />}
                  </Card>
                )
              })}
            </div>
          )}
        </section>

        {bought.length > 0 && (
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-bold text-muted-foreground">
                En el carrito ({bought.length})
              </h2>
              <button onClick={clearBought} className="text-xs font-semibold text-muted-foreground hover:text-destructive">
                Vaciar
              </button>
            </div>
            <Card className="divide-y divide-border overflow-hidden">
              {bought.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3">
                  <button
                    onClick={() => toggleBought(item.id)}
                    aria-label={`Desmarcar ${item.name}`}
                    className="grid size-7 shrink-0 place-items-center rounded-full bg-[var(--success)] text-white transition-transform active:scale-95"
                  >
                    <Check className="size-4" strokeWidth={3} />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-muted-foreground line-through">{item.name}</p>
                  </div>
                  <button
                    onClick={() => setRestockItem(item)}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary"
                  >
                    Guardar en casa
                  </button>
                  <button
                    onClick={() => deleteShoppingItem(item.id)}
                    aria-label="Eliminar"
                    className="grid size-8 place-items-center rounded-full text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </Card>
          </section>
        )}
      </div>

      <Fab label="Agregar" onClick={() => setAddOpen(true)} />
      <AddShoppingModal open={addOpen} onClose={() => setAddOpen(false)} />
      <RestockModal item={restockItem} onClose={() => setRestockItem(null)} />
    </div>
  )
}

function EmptyState() {
  return (
    <Card className="flex flex-col items-center gap-2 p-8 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-[var(--success)]/15 text-[var(--success)]">
        <ShoppingCart className="size-6" />
      </span>
      <p className="text-sm font-semibold">La lista está vacía</p>
      <p className="text-xs text-muted-foreground text-pretty">
        Agregá cosas a mano o desde las sugerencias de tu inventario.
      </p>
    </Card>
  )
}

function AddShoppingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addShoppingItem } = useStore()
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [unit, setUnit] = useState<Unit>('unidades')
  const [urgency, setUrgency] = useState<Urgency>('medio')

  function submit() {
    if (!name.trim()) return
    addShoppingItem({ name: name.trim(), quantity, unit, urgency, source: 'manual' })
    setName('')
    setQuantity(1)
    setUnit('unidades')
    setUrgency('medio')
    onClose()
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Agregar a la lista"
      footer={
        <Button className="w-full" size="lg" onClick={submit} disabled={!name.trim()}>
          Agregar
        </Button>
      }
    >
      <Field label="Producto">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) submit()
          }}
          placeholder="Ej: Leche, papel higiénico…"
          className={inputCls}
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Cantidad">
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className={inputCls}
          />
        </Field>
        <Field label="Unidad">
          <select value={unit} onChange={(e) => setUnit(e.target.value as Unit)} className={inputCls}>
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Urgencia">
        <div className="flex flex-wrap gap-2">
          {URGENCIES.map((u) => {
            const cfg = urgencyConfig[u]
            const active = urgency === u
            return (
              <button
                key={u}
                onClick={() => setUrgency(u)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                  active ? 'text-white' : 'bg-muted text-muted-foreground'
                }`}
                style={active ? { backgroundColor: `var(--${cfg.token === 'danger' ? 'destructive' : cfg.token})` } : undefined}
              >
                {cfg.label}
              </button>
            )
          })}
        </div>
      </Field>
    </Sheet>
  )
}

function RestockModal({ item, onClose }: { item: ShoppingItem | null; onClose: () => void }) {
  const { locations, addToInventoryFromShopping, deleteShoppingItem } = useStore()
  const [locationId, setLocationId] = useState(locations[0]?.id ?? '')

  if (!item) return null

  function submit() {
    if (!item) return
    addToInventoryFromShopping({ name: item.name, quantity: item.quantity, unit: item.unit, locationId })
    deleteShoppingItem(item.id)
    onClose()
  }

  return (
    <Sheet
      open={!!item}
      onClose={onClose}
      title={`Guardar ${item.name}`}
      description="Sumalo a tu inventario para tenerlo controlado."
      footer={
        <Button className="w-full" size="lg" onClick={submit}>
          Guardar en el inventario
        </Button>
      }
    >
      <div className="mb-4 flex items-center gap-2">
        <Badge tone="success">
          {item.quantity} {item.unit}
        </Badge>
      </div>
      <Field label="¿Dónde lo guardás?">
        <select value={locationId} onChange={(e) => setLocationId(e.target.value)} className={inputCls}>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      </Field>
    </Sheet>
  )
}
