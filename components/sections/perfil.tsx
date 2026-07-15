'use client'

import { useState } from 'react'
import type { SectionProps } from '@/components/app-shell'
import { useStore } from '@/components/store'
import { Card, Avatar } from '@/components/ui/primitives'
import { Field, inputCls } from '@/components/ui/sheet'
import { Check, Edit2, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function Perfil({ navigate }: SectionProps) {
  const { currentUser, updateProfile } = useStore()
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const [name, setName] = useState(currentUser?.name || '')
  const [lastName, setLastName] = useState(currentUser?.lastName || '')
  const [nickname, setNickname] = useState(currentUser?.nickname || '')
  const [birthDate, setBirthDate] = useState(currentUser?.birthDate || '')

  const handleSave = async () => {
    setSaving(true)
    await updateProfile({
      name,
      lastName,
      nickname,
      birthDate
    })
    setSaving(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  if (!currentUser) return null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold leading-tight">Tu Perfil</h2>
          <p className="text-sm text-muted-foreground">Administrá tu información personal</p>
        </div>
        <button
          onClick={handleLogout}
          className="grid size-10 place-items-center rounded-full bg-danger/10 text-danger transition-colors hover:bg-danger/20"
          aria-label="Cerrar sesión"
        >
          <LogOut className="size-5" />
        </button>
      </div>

      <Card className="flex flex-col items-center gap-4 p-6 text-center">
        <div className="relative">
          <Avatar initials={currentUser.initials} color={currentUser.color} size={80} className="text-3xl" />
          <button className="absolute bottom-0 right-0 grid size-8 place-items-center rounded-full border-2 border-background bg-secondary text-secondary-foreground shadow-sm">
            <Edit2 className="size-4" />
          </button>
        </div>
        <div>
          <p className="font-semibold text-lg">{currentUser.name} {currentUser.lastName}</p>
          <p className="text-sm text-muted-foreground">@{currentUser.nickname || currentUser.name.toLowerCase()}</p>
        </div>
      </Card>

      <div className="flex flex-col gap-4">
        <Field label="Nombre">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
            placeholder="Ej: Sofía"
          />
        </Field>
        
        <Field label="Apellido">
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={inputCls}
            placeholder="Ej: Aguilar"
          />
        </Field>

        <Field label="Apodo">
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className={inputCls}
            placeholder="Ej: Sofi"
          />
        </Field>

        <Field label="Fecha de Nacimiento">
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className={inputCls}
          />
        </Field>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary font-bold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {saving ? 'Guardando...' : <><Check className="size-5" /> Guardar cambios</>}
      </button>
    </div>
  )
}
