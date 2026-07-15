'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Clock, Users, Check, ShoppingCart, ChefHat, Sparkles, X, Plus } from 'lucide-react'
import { useStore } from '@/components/store'
import { Card, Fab } from '@/components/ui/primitives'
import { Sheet, Field, inputCls } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Segmented } from '@/components/ui/primitives'
import type { Recipe, RecipeIngredient, Unit } from '@/lib/types'

const UNITS: Unit[] = ['unidades', 'kg', 'g', 'l', 'ml', 'paquetes']

interface RecipeStatus {
  total: number
  have: number
  missing: RecipeIngredient[]
  cookable: boolean
}

export function Recetero(_props: Partial<SectionProps>) {
  const { recipes, hasInStock } = useStore()
  const [filter, setFilter] = useState<'todas' | 'cocinables'>('todas')
  const [selected, setSelected] = useState<Recipe | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  const statusOf = useMemo(() => {
    return (recipe: Recipe): RecipeStatus => {
      const missing = recipe.ingredients.filter((ing) => !hasInStock(ing.name, ing.quantity))
      return {
        total: recipe.ingredients.length,
        have: recipe.ingredients.length - missing.length,
        missing,
        cookable: missing.length === 0,
      }
    }
  }, [hasInStock])

  const list = useMemo(() => {
    if (filter === 'cocinables') return recipes.filter((r) => statusOf(r).cookable)
    return recipes
  }, [recipes, filter, statusOf])

  const cookableCount = recipes.filter((r) => statusOf(r).cookable).length

  return (
    <div className="pb-28">
      <header className="px-5 pb-3 pt-2">
        <h1 className="font-serif text-2xl font-semibold">Recetero</h1>
        <p className="text-sm text-muted-foreground">
          Podés cocinar {cookableCount} de {recipes.length} recetas con lo que tenés
        </p>
      </header>

      <div className="px-5 pb-4">
        <Segmented
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'todas', label: 'Todas' },
            { value: 'cocinables', label: `Cocinables (${cookableCount})` },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 px-5">
        {list.map((recipe) => {
          const st = statusOf(recipe)
          return (
            <button key={recipe.id} onClick={() => setSelected(recipe)} className="text-left">
              <Card className="overflow-hidden transition-transform active:scale-[0.99]">
                <div className="relative h-36 w-full">
                  {recipe.photo ? (
                    <Image src={recipe.photo || "/placeholder.svg"} alt={recipe.name} fill className="object-cover" sizes="100vw" />
                  ) : (
                    <div className="grid h-full place-items-center bg-muted text-muted-foreground">
                      <ChefHat className="size-8" />
                    </div>
                  )}
                  <div className="absolute left-3 top-3">
                    {st.cookable ? (
                      <Badge tone="success" className="shadow-sm backdrop-blur">
                        <Check className="size-3" strokeWidth={3} /> La podés hacer
                      </Badge>
                    ) : (
                      <Badge tone="warning" className="shadow-sm backdrop-blur">
                        Faltan {st.missing.length}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="p-3.5">
                  <h3 className="font-serif text-lg font-semibold">{recipe.name}</h3>
                  <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" /> {recipe.minutes} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="size-3.5" /> {recipe.servings} porciones
                    </span>
                    <span className="flex items-center gap-1">
                      <ShoppingCart className="size-3.5" /> {st.have}/{st.total}
                    </span>
                  </div>
                </div>
              </Card>
            </button>
          )
        })}

        {list.length === 0 && (
          <Card className="flex flex-col items-center gap-2 p-8 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-warning/20 text-warning-foreground">
              <Sparkles className="size-6" />
            </span>
            <p className="text-sm font-semibold">No hay recetas cocinables ahora</p>
            <p className="text-xs text-muted-foreground text-pretty">
              Reponé algunos ingredientes y volvé a mirar.
            </p>
          </Card>
        )}
      </div>

      <Fab label="Receta" onClick={() => setAddOpen(true)} />
      <RecipeDetail recipe={selected} onClose={() => setSelected(null)} statusOf={statusOf} />
      <AddRecipeModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}

function RecipeDetail({
  recipe,
  onClose,
  statusOf,
}: {
  recipe: Recipe | null
  onClose: () => void
  statusOf: (r: Recipe) => RecipeStatus
}) {
  const { addMissingToShopping, hasInStock } = useStore()
  const [added, setAdded] = useState<number | null>(null)

  if (!recipe) return null
  const st = statusOf(recipe)

  function handleAdd() {
    if (!recipe) return
    const n = addMissingToShopping(recipe)
    setAdded(n)
  }

  return (
    <Sheet open={!!recipe} onClose={() => { setAdded(null); onClose() }} title={recipe.name} description={`${recipe.minutes} min · ${recipe.servings} porciones`}>
      {recipe.photo && (
        <div className="relative mb-4 h-40 w-full overflow-hidden rounded-2xl">
          <Image src={recipe.photo || "/placeholder.svg"} alt={recipe.name} fill className="object-cover" sizes="100vw" />
        </div>
      )}

      <h4 className="mb-2 text-sm font-bold">Ingredientes</h4>
      <ul className="mb-4 space-y-1.5">
        {recipe.ingredients.map((ing, i) => {
          const have = hasInStock(ing.name, ing.quantity)
          return (
            <li key={i} className="flex items-center gap-2.5 text-sm">
              <span
                className={`grid size-5 shrink-0 place-items-center rounded-full ${
                  have ? 'bg-[var(--success)] text-white' : 'bg-muted text-muted-foreground'
                }`}
              >
                {have ? <Check className="size-3" strokeWidth={3} /> : <X className="size-3" strokeWidth={3} />}
              </span>
              <span className={have ? '' : 'text-muted-foreground'}>
                {ing.name} · {ing.quantity} {ing.unit}
              </span>
            </li>
          )
        })}
      </ul>

      {st.missing.length > 0 && (
        <div className="mb-4">
          {added === null ? (
            <Button variant="outline" className="w-full gap-2" onClick={handleAdd}>
              <ShoppingCart className="size-4" />
              Sumar {st.missing.length} faltantes a compras
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-[var(--success)]/12 py-2.5 text-sm font-semibold text-[var(--success)]">
              <Check className="size-4" strokeWidth={3} />
              {added > 0 ? `${added} sumados a compras` : 'Ya estaban en la lista'}
            </div>
          )}
        </div>
      )}

      <h4 className="mb-2 text-sm font-bold">Preparación</h4>
      <ol className="space-y-3">
        {recipe.steps.map((step, i) => (
          <li key={i} className="flex gap-3 text-sm leading-relaxed">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/12 text-xs font-bold text-primary">
              {i + 1}
            </span>
            <span className="text-pretty">{step}</span>
          </li>
        ))}
      </ol>
    </Sheet>
  )
}

function AddRecipeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { saveRecipe } = useStore()
  const [name, setName] = useState('')
  const [servings, setServings] = useState(2)
  const [minutes, setMinutes] = useState(30)
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([{ name: '', quantity: 1, unit: 'unidades' }])
  const [stepsText, setStepsText] = useState('')

  function updateIng(idx: number, patch: Partial<RecipeIngredient>) {
    setIngredients((prev) => prev.map((ing, i) => (i === idx ? { ...ing, ...patch } : ing)))
  }

  function reset() {
    setName('')
    setServings(2)
    setMinutes(30)
    setIngredients([{ name: '', quantity: 1, unit: 'unidades' }])
    setStepsText('')
  }

  function submit() {
    if (!name.trim()) return
    saveRecipe({
      name: name.trim(),
      servings,
      minutes,
      ingredients: ingredients.filter((i) => i.name.trim()),
      steps: stepsText.split('\n').map((s) => s.trim()).filter(Boolean),
    })
    reset()
    onClose()
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Nueva receta"
      footer={
        <Button className="w-full" size="lg" onClick={submit} disabled={!name.trim()}>
          Guardar receta
        </Button>
      }
    >
      <Field label="Nombre">
        <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Guiso de lentejas" className={inputCls} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Porciones">
          <input type="number" min={1} value={servings} onChange={(e) => setServings(Math.max(1, Number(e.target.value)))} className={inputCls} />
        </Field>
        <Field label="Minutos">
          <input type="number" min={1} value={minutes} onChange={(e) => setMinutes(Math.max(1, Number(e.target.value)))} className={inputCls} />
        </Field>
      </div>

      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-sm font-semibold">Ingredientes</span>
          <button
            onClick={() => setIngredients((prev) => [...prev, { name: '', quantity: 1, unit: 'unidades' }])}
            className="flex items-center gap-1 text-xs font-bold text-primary"
          >
            <Plus className="size-3.5" /> Agregar
          </button>
        </div>
        <div className="space-y-2">
          {ingredients.map((ing, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={ing.name}
                onChange={(e) => updateIng(i, { name: e.target.value })}
                placeholder="Ingrediente"
                className={inputCls + ' flex-1'}
              />
              <input
                type="number"
                min={0}
                value={ing.quantity}
                onChange={(e) => updateIng(i, { quantity: Number(e.target.value) })}
                className={inputCls + ' w-16'}
              />
              <select value={ing.unit} onChange={(e) => updateIng(i, { unit: e.target.value as Unit })} className={inputCls + ' w-24'}>
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      <Field label="Pasos" hint="Un paso por línea">
        <textarea
          value={stepsText}
          onChange={(e) => setStepsText(e.target.value)}
          rows={4}
          placeholder={'Rehogar la cebolla…\nAgregar las lentejas…'}
          className={inputCls + ' resize-none'}
        />
      </Field>
    </Sheet>
  )
}
