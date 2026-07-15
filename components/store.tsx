'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type {
  Activity,
  HouseLocation,
  InventoryItem,
  Member,
  Recipe,
  ServiceExpense,
  ShoppingItem,
  Unit,
  Urgency,
  Household
} from '@/lib/types'
import { isLowStock, normalize } from '@/lib/helpers'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

interface StoreValue {
  currentUser: Member | null
  members: Member[]
  household: Household | null
  locations: HouseLocation[]
  inventory: InventoryItem[]
  shopping: ShoppingItem[]
  recipes: Recipe[]
  services: ServiceExpense[]
  activity: Activity[]
  
  // inventory
  addLocation: (name: string, icon: string) => Promise<string | null>
  saveItem: (item: Partial<InventoryItem> & { id?: string }) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  // shopping
  addShoppingItem: (data: { name: string; quantity: number; unit: Unit; urgency: Urgency; source?: string }) => Promise<void>
  toggleBought: (id: string) => Promise<void>
  setUrgency: (id: string, urgency: Urgency) => Promise<void>
  deleteShoppingItem: (id: string) => Promise<void>
  clearBought: () => Promise<void>
  addToInventoryFromShopping: (data: { name: string; quantity: number; unit: Unit; locationId: string }) => Promise<void>
  // recipes
  saveRecipe: (recipe: Partial<Recipe> & { id?: string }) => Promise<void>
  addMissingToShopping: (recipe: Recipe) => Promise<number>
  // services
  saveService: (svc: Partial<ServiceExpense> & { id?: string }) => Promise<void>
  toggleServiceStatus: (id: string) => Promise<void>
  // profile
  updateProfile: (data: Partial<Member>) => Promise<void>
  // helpers
  hasInStock: (name: string, needed: number) => boolean
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children, session }: { children: ReactNode, session: any }) {
  const [loading, setLoading] = useState(true)
  
  const [currentUser, setCurrentUser] = useState<Member | null>(null)
  const [household, setHousehold] = useState<Household | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  
  const [locations, setLocations] = useState<HouseLocation[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [shopping, setShopping] = useState<ShoppingItem[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [services, setServices] = useState<ServiceExpense[]>([])
  const [activity, setActivity] = useState<Activity[]>([])

  const supabase = createClient()

  useEffect(() => {
    let hhId: string
    
    async function loadData() {
      if (!session?.user?.id) return

      const { data: memData } = await supabase.from('members').select('*, households(*)').eq('user_id', session.user.id).single()
      if (!memData || !memData.households) return

      setCurrentUser({
        id: memData.user_id,
        name: memData.name,
        initials: memData.initials,
        color: memData.color,
        online: memData.online,
        lastName: memData.last_name || undefined,
        nickname: memData.nickname || undefined,
        birthDate: memData.birth_date || undefined
      })
      
      const hh = Array.isArray(memData.households) ? memData.households[0] : memData.households
      setHousehold({
        name: hh.name,
        code: hh.invite_code
      })
      
      hhId = hh.id

      const [
        { data: ms },
        { data: ls },
        { data: is },
        { data: ss },
        { data: rs },
        { data: vs },
        { data: as }
      ] = await Promise.all([
        supabase.from('members').select('*').eq('household_id', hhId),
        supabase.from('locations').select('*').eq('household_id', hhId),
        supabase.from('inventory_items').select('*').eq('household_id', hhId).order('name'),
        supabase.from('shopping_items').select('*').eq('household_id', hhId).order('created_at', { ascending: false }),
        supabase.from('recipes').select('*').eq('household_id', hhId).order('created_at', { ascending: false }),
        supabase.from('services').select('*').eq('household_id', hhId).order('due_date', { ascending: true }),
        supabase.from('activities').select('*').eq('household_id', hhId).order('timestamp', { ascending: false }).limit(20)
      ])

      if (ms) setMembers(ms.map(m => ({ 
        id: m.user_id, name: m.name, initials: m.initials, color: m.color, online: m.online,
        lastName: m.last_name || undefined, nickname: m.nickname || undefined, birthDate: m.birth_date || undefined
      })))
      if (ls) setLocations(ls.map(l => ({ id: l.id, name: l.name, icon: l.icon })))
      if (is) setInventory(is.map(i => ({
        id: i.id, name: i.name, quantity: Number(i.quantity), unit: i.unit as Unit,
        locationId: i.location_id || '', minStock: i.min_stock || undefined,
        expiry: i.expiry || undefined, photo: i.photo || undefined,
        updatedBy: i.updated_by || '', updatedAt: i.updated_at
      })))
      if (ss) setShopping(ss.map(s => ({
        id: s.id, name: s.name, quantity: Number(s.quantity), unit: s.unit as Unit,
        urgency: s.urgency as Urgency, bought: s.bought, addedBy: s.added_by || '', source: s.source
      })))
      if (rs) setRecipes(rs.map(r => ({
        id: r.id, name: r.name, photo: r.photo || undefined, servings: r.servings, minutes: r.minutes,
        ingredients: r.ingredients as any, steps: r.steps as any
      })))
      if (vs) setServices(vs.map(s => ({
        id: s.id, category: s.category, icon: s.icon, provider: s.provider, amount: Number(s.amount),
        dueDate: s.due_date, status: s.status as any, recurrence: s.recurrence as any
      })))
      if (as) setActivity(as.map(a => ({
        id: a.id, memberId: a.member_id, text: a.text, section: a.section as any, timestamp: a.timestamp
      })))

      setLoading(false)
    }

    loadData()

    const channel = supabase
      .channel('public-schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
        },
        (payload) => {
          console.log('Cambio detectado en base de datos:', payload)
          loadData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [session, supabase])

  async function logActivity(text: string, section: string, hhId: string) {
    if (!currentUser) return
    const { data } = await supabase.from('activities').insert({
      household_id: hhId,
      member_id: currentUser.id,
      text,
      section
    }).select().single()
    
    if (data) {
      setActivity(prev => [{
        id: data.id, memberId: data.member_id, text: data.text, section: data.section as any, timestamp: data.timestamp
      }, ...prev].slice(0, 20))
    }
  }

  const value = useMemo<StoreValue | null>(() => {
    if (loading || !currentUser || !household) return null
    
    // We need the household ID to insert things. Let's fetch it from the DB context.
    // Instead of querying again, we can just grab it by getting the current member's household_id
    // But we didn't save it. Let's assume we can fetch it when needed or just save it.
    // Wait, let's just make a small helper
    const getHhId = async () => {
      const { data } = await supabase.from('members').select('household_id').eq('user_id', currentUser.id).single()
      return data?.household_id
    }

    function hasInStock(name: string, needed: number) {
      const match = inventory.find((i) => normalize(i.name) === normalize(name))
      return !!match && match.quantity >= needed
    }

    return {
      currentUser,
      members,
      household,
      locations,
      inventory,
      shopping,
      recipes,
      services,
      activity,

      async addLocation(name, icon) {
        const hhId = await getHhId()
        if (!hhId) return null
        const { data } = await supabase.from('locations').insert({ household_id: hhId, name, icon }).select().single()
        if (data) {
          setLocations(prev => [...prev, { id: data.id, name: data.name, icon: data.icon }])
          return data.id
        }
        return null
      },

      async saveItem(item) {
        const hhId = await getHhId()
        if (!hhId) return

        if (item.id) {
          const { data } = await supabase.from('inventory_items').update({
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            location_id: item.locationId,
            min_stock: item.minStock,
            expiry: item.expiry,
            updated_by: currentUser.id,
            updated_at: new Date().toISOString()
          }).eq('id', item.id).select().single()

          if (data) {
            setInventory(prev => prev.map(i => i.id === data.id ? {
              ...i, name: data.name, quantity: Number(data.quantity), unit: data.unit as Unit,
              locationId: data.location_id || '', minStock: data.min_stock || undefined,
              expiry: data.expiry || undefined, updatedBy: data.updated_by || '', updatedAt: data.updated_at
            } : i))
            logActivity(`actualizó ${data.name} en el inventario`, 'inventario', hhId)
          }
        } else {
          const { data } = await supabase.from('inventory_items').insert({
            household_id: hhId,
            name: item.name || 'Sin nombre',
            quantity: item.quantity ?? 1,
            unit: item.unit || 'unidades',
            location_id: item.locationId || locations[0]?.id,
            min_stock: item.minStock,
            expiry: item.expiry,
            updated_by: currentUser.id
          }).select().single()

          if (data) {
            setInventory(prev => [{
              id: data.id, name: data.name, quantity: Number(data.quantity), unit: data.unit as Unit,
              locationId: data.location_id || '', minStock: data.min_stock || undefined,
              expiry: data.expiry || undefined, updatedBy: data.updated_by || '', updatedAt: data.updated_at
            }, ...prev].sort((a,b) => a.name.localeCompare(b.name)))
            logActivity(`agregó ${data.name} al inventario`, 'inventario', hhId)
          }
        }
      },

      async deleteItem(id) {
        await supabase.from('inventory_items').delete().eq('id', id)
        setInventory(prev => prev.filter(i => i.id !== id))
      },

      async addShoppingItem(data) {
        const hhId = await getHhId()
        if (!hhId) return
        
        if (shopping.some(s => normalize(s.name) === normalize(data.name) && !s.bought)) return
        
        const { data: res } = await supabase.from('shopping_items').insert({
          household_id: hhId,
          name: data.name,
          quantity: data.quantity,
          unit: data.unit,
          urgency: data.urgency,
          added_by: currentUser.id,
          source: data.source || 'manual'
        }).select().single()

        if (res) {
          setShopping(prev => [{
            id: res.id, name: res.name, quantity: Number(res.quantity), unit: res.unit as Unit,
            urgency: res.urgency as Urgency, bought: res.bought, addedBy: res.added_by || '', source: res.source
          }, ...prev])
          logActivity(`sumó ${res.name} a la lista de compras`, 'compras', hhId)
        }
      },

      async toggleBought(id) {
        const s = shopping.find(i => i.id === id)
        if (!s) return
        const { data } = await supabase.from('shopping_items').update({ bought: !s.bought }).eq('id', id).select().single()
        if (data) {
          setShopping(prev => prev.map(i => i.id === id ? { ...i, bought: data.bought } : i))
        }
      },

      async setUrgency(id, urgency) {
        const { data } = await supabase.from('shopping_items').update({ urgency }).eq('id', id).select().single()
        if (data) {
          setShopping(prev => prev.map(i => i.id === id ? { ...i, urgency: data.urgency as Urgency } : i))
        }
      },

      async deleteShoppingItem(id) {
        await supabase.from('shopping_items').delete().eq('id', id)
        setShopping(prev => prev.filter(s => s.id !== id))
      },

      async clearBought() {
        const boughtIds = shopping.filter(s => s.bought).map(s => s.id)
        if (boughtIds.length === 0) return
        await supabase.from('shopping_items').delete().in('id', boughtIds)
        setShopping(prev => prev.filter(s => !s.bought))
      },

      async addToInventoryFromShopping(data) {
        const hhId = await getHhId()
        if (!hhId) return

        const existing = inventory.find(i => normalize(i.name) === normalize(data.name) && i.locationId === data.locationId)
        if (existing) {
          const { data: res } = await supabase.from('inventory_items').update({
            quantity: existing.quantity + data.quantity,
            updated_by: currentUser.id,
            updated_at: new Date().toISOString()
          }).eq('id', existing.id).select().single()
          
          if (res) {
            setInventory(prev => prev.map(i => i.id === res.id ? { ...i, quantity: Number(res.quantity), updatedAt: res.updated_at, updatedBy: res.updated_by || '' } : i))
            logActivity(`sumó ${res.name} al inventario desde compras`, 'inventario', hhId)
          }
        } else {
          const { data: res } = await supabase.from('inventory_items').insert({
            household_id: hhId,
            name: data.name,
            quantity: data.quantity,
            unit: data.unit,
            location_id: data.locationId,
            updated_by: currentUser.id
          }).select().single()
          
          if (res) {
            setInventory(prev => [{
              id: res.id, name: res.name, quantity: Number(res.quantity), unit: res.unit as Unit,
              locationId: res.location_id || '', minStock: res.min_stock || undefined,
              expiry: res.expiry || undefined, updatedBy: res.updated_by || '', updatedAt: res.updated_at
            }, ...prev].sort((a,b) => a.name.localeCompare(b.name)))
            logActivity(`sumó ${res.name} al inventario desde compras`, 'inventario', hhId)
          }
        }
      },

      async saveRecipe(recipe) {
        const hhId = await getHhId()
        if (!hhId) return

        if (recipe.id) {
          const { data } = await supabase.from('recipes').update({
            name: recipe.name,
            servings: recipe.servings,
            minutes: recipe.minutes,
            ingredients: recipe.ingredients as any,
            steps: recipe.steps as any
          }).eq('id', recipe.id).select().single()
          
          if (data) {
            setRecipes(prev => prev.map(r => r.id === data.id ? { ...r, ...data, photo: data.photo || undefined, ingredients: data.ingredients as any, steps: data.steps as any } : r))
            logActivity(`editó la receta ${data.name}`, 'recetero', hhId)
          }
        } else {
          const { data } = await supabase.from('recipes').insert({
            household_id: hhId,
            name: recipe.name || 'Nueva receta',
            servings: recipe.servings ?? 2,
            minutes: recipe.minutes ?? 30,
            ingredients: (recipe.ingredients || []) as any,
            steps: (recipe.steps || []) as any
          }).select().single()
          
          if (data) {
            setRecipes(prev => [{
              id: data.id, name: data.name, servings: data.servings, minutes: data.minutes,
              ingredients: data.ingredients as any, steps: data.steps as any
            }, ...prev])
            logActivity(`creó la receta ${data.name}`, 'recetero', hhId)
          }
        }
      },

      async addMissingToShopping(recipe) {
        const hhId = await getHhId()
        if (!hhId) return 0
        
        const missing = recipe.ingredients.filter((ing) => !hasInStock(ing.name, ing.quantity))
        let addedCount = 0
        
        for (const ing of missing) {
          if (shopping.some(s => normalize(s.name) === normalize(ing.name) && !s.bought)) continue
          
          const { data } = await supabase.from('shopping_items').insert({
            household_id: hhId,
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
            urgency: 'medio',
            added_by: currentUser.id,
            source: 'receta'
          }).select().single()
          
          if (data) {
            addedCount++
            setShopping(prev => [{
              id: data.id, name: data.name, quantity: Number(data.quantity), unit: data.unit as Unit,
              urgency: data.urgency as Urgency, bought: data.bought, addedBy: data.added_by || '', source: data.source
            }, ...prev])
          }
        }
        
        if (addedCount > 0) logActivity(`sumó ${addedCount} ingredientes de ${recipe.name} a compras`, 'compras', hhId)
        return addedCount
      },

      async saveService(svc) {
        const hhId = await getHhId()
        if (!hhId) return

        if (svc.id) {
          const { data } = await supabase.from('services').update({
            category: svc.category,
            icon: svc.icon,
            provider: svc.provider,
            amount: svc.amount,
            due_date: svc.dueDate,
            status: svc.status,
            recurrence: svc.recurrence
          }).eq('id', svc.id).select().single()

          if (data) {
            setServices(prev => prev.map(s => s.id === data.id ? { ...s, ...data, dueDate: data.due_date, status: data.status as any, recurrence: data.recurrence as any, amount: Number(data.amount) } : s))
            logActivity(`actualizó el gasto de ${data.category}`, 'servicios', hhId)
          }
        } else {
          const { data } = await supabase.from('services').insert({
            household_id: hhId,
            category: svc.category || 'Otro',
            icon: svc.icon || 'building',
            provider: svc.provider || '',
            amount: svc.amount ?? 0,
            due_date: svc.dueDate || new Date().toISOString().split('T')[0],
            status: svc.status || 'pendiente',
            recurrence: svc.recurrence || 'mensual'
          }).select().single()

          if (data) {
            setServices(prev => [{
              id: data.id, category: data.category, icon: data.icon, provider: data.provider, amount: Number(data.amount),
              dueDate: data.due_date, status: data.status as any, recurrence: data.recurrence as any
            }, ...prev].sort((a,b) => a.dueDate.localeCompare(b.dueDate)))
            logActivity(`agregó el gasto de ${data.category}`, 'servicios', hhId)
          }
        }
      },

      async toggleServiceStatus(id) {
        const svc = services.find(s => s.id === id)
        if (!svc) return
        const newStatus = svc.status === 'pagado' ? 'pendiente' : 'pagado'
        const { data } = await supabase.from('services').update({ status: newStatus }).eq('id', id).select().single()
        if (data) {
          setServices(prev => prev.map(s => s.id === id ? { ...s, status: data.status as any } : s))
        }
      },

      async updateProfile(data) {
        if (!currentUser) return
        
        const updates = {
          name: data.name ?? currentUser.name,
          last_name: data.lastName ?? currentUser.lastName ?? null,
          nickname: data.nickname ?? currentUser.nickname ?? null,
          birth_date: data.birthDate ?? currentUser.birthDate ?? null,
        }
        
        const { error } = await supabase.from('members').update(updates).eq('user_id', currentUser.id)
        if (!error) {
          setCurrentUser({ ...currentUser, ...data })
          setMembers(prev => prev.map(m => m.id === currentUser.id ? { ...m, ...data } : m))
        }
      },

      hasInStock,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, currentUser, household, locations, inventory, shopping, recipes, services, activity, supabase])

  if (loading || !value) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">Sincronizando hogar...</p>
        </div>
      </div>
    )
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore debe usarse dentro de StoreProvider')
  return ctx
}

export function useLowStock() {
  const { inventory } = useStore()
  return inventory.filter(isLowStock)
}
