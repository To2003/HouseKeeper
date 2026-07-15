'use client'

import { useEffect, useState } from 'react'
import { Camera, Trash2 } from 'lucide-react'
import { Sheet, Field, inputCls } from '@/components/ui/sheet'
import { useStore } from '@/components/store'
import type { InventoryItem, Unit } from '@/lib/types'

const units: Unit[] = ['unidades', 'kg', 'g', 'l', 'ml', 'paquetes']

export function ItemModal({
  open,
  onClose,
  editing,
  defaultLocationId,
}: {
  open: boolean
  onClose: () => void
  editing?: InventoryItem | null
  defaultLocationId?: string
}) {
  const { locations, saveItem, deleteItem } = useStore()
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [unit, setUnit] = useState<Unit>('unidades')
  const [locationId, setLocationId] = useState(defaultLocationId || locations[0]?.id || '')
  const [minStock, setMinStock] = useState('')
  const [expiry, setExpiry] = useState('')

  useEffect(() => {
    if (!open) return
    if (editing) {
      setName(editing.name)
      setQuantity(String(editing.quantity))
      setUnit(editing.unit)
      setLocationId(editing.locationId)
      setMinStock(editing.minStock !== undefined ? String(editing.minStock) : '')
      setExpiry(editing.expiry || '')
    } else {
      setName('')
      setQuantity('1')
      setUnit('unidades')
      setLocationId(defaultLocationId || locations[0]?.id || '')
      setMinStock('')
      setExpiry('')
    }
  }, [open, editing, defaultLocationId, locations])

  function submit() {
    if (!name.trim()) return
    saveItem({
      id: editing?.id,
      name: name.trim(),
      quantity: Number(quantity) || 0,
      unit,
      locationId,
      minStock: minStock ? Number(minStock) : undefined,
      expiry: expiry || undefined,
    })
    onClose()
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={editing ? 'Editar item' : 'Nuevo item'}
      description={editing ? 'Actualizá los datos del producto.' : 'Sumá un producto a tu inventario.'}
      footer={
        <div className="flex gap-2">
          {editing ? (
            <button
              onClick={() => {
                deleteItem(editing.id)
                onClose()
              }}
              className="grid size-12 shrink-0 place-items-center rounded-2xl bg-danger/12 text-danger transition-colors active:bg-danger/20"
              aria-label="Eliminar item"
            >
              <Trash2 className="size-5" />
            </button>
          ) : null}
          <button
            onClick={submit}
            className="h-12 flex-1 rounded-2xl bg-primary font-bold text-primary-foreground active:scale-[0.98]"
          >
            {editing ? 'Guardar cambios' : 'Agregar al inventario'}
          </button>
        </div>
      }
    >
      <button className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/40 py-6 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted">
        <Camera className="size-5" /> {editing ? 'Cambiar foto (opcional)' : 'Agregar foto (opcional)'}
      </button>

      <Field label="Nombre">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Leche La Serenísima" className={inputCls} autoFocus />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Cantidad">
          <input value={quantity} onChange={(e) => setQuantity(e.target.value)} type="number" min="0" step="any" className={inputCls} />
        </Field>
        <Field label="Unidad">
          <select value={unit} onChange={(e) => setUnit(e.target.value as Unit)} className={inputCls}>
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Ubicación">
        <select value={locationId} onChange={(e) => setLocationId(e.target.value)} className={inputCls}>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Stock mínimo" hint="Opcional">
          <input value={minStock} onChange={(e) => setMinStock(e.target.value)} type="number" min="0" placeholder="—" className={inputCls} />
        </Field>
        <Field label="Vencimiento" hint="Opcional">
          <input value={expiry} onChange={(e) => setExpiry(e.target.value)} type="date" className={inputCls} />
        </Field>
      </div>
    </Sheet>
  )
}
