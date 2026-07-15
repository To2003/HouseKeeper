export type Unit = 'unidades' | 'kg' | 'g' | 'l' | 'ml' | 'paquetes'

export type Urgency = 'urgente' | 'alto' | 'medio' | 'bajo'

export type ServiceStatus = 'pagado' | 'pendiente'

export type Recurrence = 'mensual' | 'unica'

export interface Member {
  id: string
  name: string
  initials: string
  color: string
  online: boolean
  lastName?: string
  nickname?: string
  birthDate?: string
}

export interface HouseLocation {
  id: string
  name: string
  icon: string
}

export interface InventoryItem {
  id: string
  name: string
  quantity: number
  unit: Unit
  locationId: string
  minStock?: number
  /** ISO date string */
  expiry?: string
  photo?: string
  updatedBy: string
  updatedAt: string
}

export interface ShoppingItem {
  id: string
  name: string
  quantity: number
  unit: Unit
  urgency: Urgency
  bought: boolean
  addedBy: string
  /** origin, e.g. 'stock' | 'receta' | 'manual' */
  source: string
}

export interface RecipeIngredient {
  name: string
  quantity: number
  unit: Unit
}

export interface Recipe {
  id: string
  name: string
  photo?: string
  servings: number
  minutes: number
  ingredients: RecipeIngredient[]
  steps: string[]
}

export interface ServiceExpense {
  id: string
  category: string
  icon: string
  provider: string
  amount: number
  /** ISO date string */
  dueDate: string
  status: ServiceStatus
  recurrence: Recurrence
}

export interface Activity {
  id: string
  memberId: string
  text: string
  section: 'inventario' | 'compras' | 'recetero' | 'servicios'
  timestamp: string
}

export interface Household {
  name: string
  code: string
}
