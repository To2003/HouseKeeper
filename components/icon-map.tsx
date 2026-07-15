import {
  Refrigerator,
  Archive,
  Bath,
  WashingMachine,
  Snowflake,
  ShoppingCart,
  Zap,
  Droplet,
  Wifi,
  Flame,
  Phone,
  Building2,
  Home,
  Package,
  type LucideIcon,
} from 'lucide-react'

const map: Record<string, LucideIcon> = {
  // ubicaciones
  fridge: Refrigerator,
  pantry: Archive,
  bath: Bath,
  laundry: WashingMachine,
  freezer: Snowflake,
  home: Home,
  package: Package,
  // categorías de servicios
  cart: ShoppingCart,
  zap: Zap,
  droplet: Droplet,
  wifi: Wifi,
  flame: Flame,
  phone: Phone,
  building: Building2,
}

export function DynIcon({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const Icon = map[name] ?? Package
  return <Icon className={className} aria-hidden="true" />
}

export const locationIconOptions = [
  { key: 'fridge', label: 'Heladera' },
  { key: 'pantry', label: 'Alacena' },
  { key: 'bath', label: 'Baño' },
  { key: 'laundry', label: 'Lavadero' },
  { key: 'freezer', label: 'Freezer' },
  { key: 'home', label: 'General' },
  { key: 'package', label: 'Otro' },
]

export const serviceIconOptions = [
  { key: 'cart', label: 'Supermercado' },
  { key: 'zap', label: 'Luz' },
  { key: 'droplet', label: 'Agua' },
  { key: 'flame', label: 'Gas' },
  { key: 'wifi', label: 'Internet' },
  { key: 'phone', label: 'Celular' },
  { key: 'building', label: 'Expensas' },
]
