'use client'

import { useMemo, useState } from 'react'
import { Search, Plus, Pencil, CalendarClock, PackageX } from 'lucide-react'
import type { SectionProps } from '@/components/app-shell'
import { useStore } from '@/components/store'
import { Card, Fab, Avatar } from '@/components/ui/primitives'
import { Badge } from '@/components/ui/badge'
import { DynIcon } from '@/components/icon-map'
import { Sheet, Field, inputCls } from '@/components/ui/sheet'
import { ItemModal } from '@/components/sections/item-modal'
import { expiryState, isLowStock, formatExpiry, normalize } from '@/lib/helpers'
import { locationIconOptions } from '@/components/icon-map'
import type { InventoryItem } from '@/lib/types'

export function Inventario(_props: SectionProps) {
  const { locations, inventory, addLocation, members } = useStore()
  const [activeLoc, setActiveLoc] = useState(locations[0]?.id || '')
  const [query, setQuery] = useState('')
  const [itemOpen, setItemOpen] = useState(false)
  const [editing, setEditing] = useState<InventoryItem | null>(null)
  const [locOpen, setLocOpen] = useState(false)

  const searching = query.trim().length > 0

  const visibleItems = useMemo(() => {
    if (searching) {
      const q = normalize(query)
      return inventory.filter((i) => normalize(i.name).includes(q))
    }
    return inventory.filter((i) => i.locationId === activeLoc)
  }, [inventory, activeLoc, query, searching])

  const countByLoc = (id: string) => inventory.filter((i) => i.locationId === id).length
  const memberById = (id: string) => members.find((m) => m.id === id)

  function openNew() {
    setEditing(null)
    setItemOpen(true)
  }
  function openEdit(item: InventoryItem) {
    setEditing(item)
    setItemOpen(true)
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-serif text-2xl font-bold leading-tight">Inventario</h2>
        <p className="text-sm text-muted-foreground">{inventory.length} productos en tu hogar</p>
      </div>

      {/* Buscador global */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar en todo el inventario…"
          className={`${inputCls} pl-11`}
        />
      </div>

      {/* Chips de ubicaciones */}
      {!searching && (
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 no-scrollbar">
          {locations.map((l) => {
            const active = l.id === activeLoc
            return (
              <button
                key={l.id}
                onClick={() => setActiveLoc(l.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors ${
                  active ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-foreground'
                }`}
              >
                <DynIcon name={l.icon} className="size-4" />
                {l.name}
                <span className={`text-xs ${active ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {countByLoc(l.id)}
                </span>
              </button>
            )
          })}
          <button
            onClick={() => setLocOpen(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-dashed border-border px-3.5 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted"
          >
            <Plus className="size-4" /> Nueva ubicación
          </button>
        </div>
      )}

      {/* Lista de items */}
      <div className="flex flex-col gap-2.5">
        {visibleItems.length === 0 ? (
          <Card className="flex flex-col items-center gap-2 p-10 text-center">
            <PackageX className="size-8 text-muted-foreground" />
            <p className="font-semibold">Nada por acá</p>
            <p className="text-sm text-muted-foreground">
              {searching ? 'No encontramos ese producto.' : 'Sumá tu primer item con el botón +.'}
            </p>
          </Card>
        ) : (
          visibleItems.map((item) => {
            const low = isLowStock(item)
            const exp = expiryState(item)
            const loc = locations.find((l) => l.id === item.locationId)
            const editor = memberById(item.updatedBy)
            return (
              <Card key={item.id} className="flex items-center gap-3 p-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground">
                  <DynIcon name={loc?.icon || 'package'} className="size-5" />
                </span>
                <button onClick={() => openEdit(item)} className="min-w-0 flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold">{item.name}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.quantity} {item.unit}
                    {searching && loc ? ` · ${loc.name}` : ''}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    {low && (
                      <Badge tone="danger">
                        <PackageX className="size-3" /> Stock bajo
                      </Badge>
                    )}
                    {exp === 'pronto' && (
                      <Badge tone="warning">
                        <CalendarClock className="size-3" /> {formatExpiry(item.expiry!)}
                      </Badge>
                    )}
                    {exp === 'vencido' && (
                      <Badge tone="danger">
                        <CalendarClock className="size-3" /> Vencido
                      </Badge>
                    )}
                    {editor && (
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Avatar initials={editor.initials} color={editor.color} size={16} /> {item.updatedAt}
                      </span>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => openEdit(item)}
                  aria-label={`Editar ${item.name}`}
                  className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Pencil className="size-4" />
                </button>
              </Card>
            )
          })
        )}
      </div>

      <Fab onClick={openNew} label="Agregar" />

      <ItemModal open={itemOpen} onClose={() => setItemOpen(false)} editing={editing} defaultLocationId={activeLoc} />
      <NewLocationModal open={locOpen} onClose={() => setLocOpen(false)} onCreate={async (name, icon) => {
        const id = await addLocation(name, icon)
        if (id) setActiveLoc(id)
      }} />
    </div>
  )
}

function NewLocationModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean
  onClose: () => void
  onCreate: (name: string, icon: string) => Promise<void> | void
}) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState(locationIconOptions[0].key)

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Nueva ubicación"
      description="Creá un lugar personalizado para organizar tus productos."
      footer={
        <button
          onClick={async () => {
            if (!name.trim()) return
            await onCreate(name.trim(), icon)
            setName('')
            onClose()
          }}
          className="h-12 w-full rounded-2xl bg-primary font-bold text-primary-foreground active:scale-[0.98]"
        >
          Crear ubicación
        </button>
      }
    >
      <Field label="Nombre">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Placard, Despensa…" className={inputCls} autoFocus />
      </Field>
      <Field label="Ícono">
        <div className="grid grid-cols-4 gap-2">
          {locationIconOptions.map((o) => (
            <button
              key={o.key}
              onClick={() => setIcon(o.key)}
              className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-semibold transition-colors ${
                icon === o.key ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
              }`}
            >
              <DynIcon name={o.key} className="size-5" />
              {o.label}
            </button>
          ))}
        </div>
      </Field>
    </Sheet>
  )
}
