import type { InventoryItem, ShoppingItem, Urgency } from './types'
import { TODAY } from './mock-data'

export function daysUntil(dateStr: string): number {
  const today = new Date(TODAY + 'T00:00:00')
  const target = new Date(dateStr + 'T00:00:00')
  const diff = target.getTime() - today.getTime()
  return Math.round(diff / (1000 * 60 * 60 * 24))
}

export type ExpiryState = 'ok' | 'pronto' | 'vencido' | null

export function expiryState(item: InventoryItem): ExpiryState {
  if (!item.expiry) return null
  const d = daysUntil(item.expiry)
  if (d < 0) return 'vencido'
  if (d <= 3) return 'pronto'
  return 'ok'
}

export function isLowStock(item: InventoryItem): boolean {
  return item.minStock !== undefined && item.quantity < item.minStock
}

export function formatMoney(n: number): string {
  return '$' + n.toLocaleString('es-AR')
}

export function formatExpiry(dateStr: string): string {
  const d = daysUntil(dateStr)
  if (d < 0) return `Venció hace ${Math.abs(d)} d`
  if (d === 0) return 'Vence hoy'
  if (d === 1) return 'Vence mañana'
  return `Vence en ${d} d`
}

export function formatDueDate(dateStr: string): string {
  const d = daysUntil(dateStr)
  const date = new Date(dateStr + 'T00:00:00')
  const label = date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
  if (d < 0) return `Venció el ${label}`
  if (d === 0) return 'Vence hoy'
  if (d === 1) return 'Vence mañana'
  return `Vence el ${label}`
}

export const urgencyConfig: Record<
  Urgency,
  { label: string; token: string; order: number }
> = {
  urgente: { label: 'Urgente', token: 'danger', order: 0 },
  alto: { label: 'Alto', token: 'info', order: 1 },
  medio: { label: 'Medio', token: 'warning', order: 2 },
  bajo: { label: 'Bajo', token: 'success', order: 3 },
}

export function sortShopping(items: ShoppingItem[]): ShoppingItem[] {
  return [...items].sort(
    (a, b) => urgencyConfig[a.urgency].order - urgencyConfig[b.urgency].order,
  )
}

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return 'hace instantes'
  if (diffMin < 60) return `hace ${diffMin} min`
  if (diffHour < 24) return `hace ${diffHour} h`
  if (diffDay === 1) return 'ayer'
  if (diffDay < 7) return `hace ${diffDay} días`

  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}
