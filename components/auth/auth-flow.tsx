'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Home, Mail, Lock, ArrowRight, Users, KeyRound, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { inputCls } from '@/components/ui/sheet'
import { household } from '@/lib/mock-data'
import { createClient } from '@/lib/supabase/client'

type Stage = 'landing' | 'auth' | 'onboarding'
type OnboardMode = 'crear' | 'unirse'

export function AuthFlow({ onDone, session }: { onDone: () => void, session?: any }) {
  const [stage, setStage] = useState<Stage>(session ? 'onboarding' : 'landing')
  const [authMode, setAuthMode] = useState<'in' | 'up'>('in')

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background">
      {stage === 'landing' && !session && (
        <HeroScreen 
          onLogin={() => { setAuthMode('in'); setStage('auth') }}
          onRegister={() => { setAuthMode('up'); setStage('auth') }}
        />
      )}
      {stage === 'auth' && !session && (
        <EmailAuthScreen 
          initialMode={authMode}
          onBack={() => setStage('landing')}
          onNext={() => setStage('onboarding')}
        />
      )}
      {stage === 'onboarding' && (
        <OnboardingScreen onDone={onDone} session={session} />
      )}
    </div>
  )
}

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
        <Home className="size-5" strokeWidth={2.5} />
      </span>
      <span className="font-serif text-xl font-bold tracking-tight">House Keeper</span>
    </div>
  )
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.9 1.5l2.6-2.5C16.9 3.4 14.7 2.4 12 2.4 6.8 2.4 2.6 6.6 2.6 12S6.8 21.6 12 21.6c5.8 0 9.6-4.1 9.6-9.8 0-.66-.07-1.16-.16-1.66H12z"
      />
    </svg>
  )
}

function HeroScreen({ onLogin, onRegister }: { onLogin: () => void, onRegister: () => void }) {
  return (
    <div className="flex flex-1 flex-col px-6 pb-8 pt-10">
      <Brand />

      <div className="relative mx-auto mt-6 aspect-[4/3] w-full max-w-xs overflow-hidden rounded-3xl border border-border">
        <Image src="/images/auth-home.png" alt="Hogar cálido y ordenado" fill className="object-cover" priority />
      </div>

      <div className="flex-1 mt-6">
        <h1 className="font-serif text-3xl font-bold leading-tight text-balance">
          Tu hogar, ordenado y compartido
        </h1>
        <p className="mt-3 text-pretty text-muted-foreground leading-relaxed">
          Inventario, compras, recetas y gastos. Todo en un solo lugar, en tiempo real con tu familia.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <button
          onClick={onRegister}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary font-bold text-primary-foreground transition-transform active:scale-[0.98]"
        >
          Comenzar gratis
          <ArrowRight className="size-5" />
        </button>
        <button
          onClick={onLogin}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-border bg-transparent font-bold text-foreground transition-colors hover:bg-muted active:scale-[0.98]"
        >
          Volver a entrar
        </button>
      </div>
    </div>
  )
}

import { ArrowLeft } from 'lucide-react'

function EmailAuthScreen({ initialMode, onBack, onNext }: { initialMode: 'in' | 'up', onBack: () => void, onNext: () => void }) {
  const [mode, setMode] = useState<'in' | 'up'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
    if (error) setError(error.message)
    setLoading(false)
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (mode === 'in') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else onNext()
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else onNext() // Assuming auto-confirm is enabled or we just let them in to wait
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-1 flex-col px-6 pb-8 pt-6">
      <button onClick={onBack} className="mb-6 flex w-fit items-center text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="mr-1 size-4" />
        Volver
      </button>

      <Brand />

      <div className="mt-8 mb-6">
        <h2 className="font-serif text-2xl font-bold">
          {mode === 'in' ? 'Bienvenido de nuevo' : 'Creá tu cuenta'}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === 'in' ? 'Iniciá sesión para continuar a tu hogar.' : 'Empezá a organizar tu hogar hoy mismo.'}
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-border bg-card font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-50"
      >
        <GoogleMark />
        Continuar con Google
      </button>

      <div className="my-5 flex items-center gap-3 text-xs font-medium text-muted-foreground">
        <span className="h-px flex-1 bg-border" />o con tu email<span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleEmailAuth} className="flex flex-col gap-3">
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="email" 
            required 
            placeholder="tu@email.com" 
            className={cn(inputCls, 'pl-11')} 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="password" 
            required 
            placeholder="Contraseña" 
            className={cn(inputCls, 'pl-11')} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary font-bold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? <Loader2 className="size-5 animate-spin" /> : mode === 'in' ? 'Iniciar sesión' : 'Crear cuenta'}
          {!loading && <ArrowRight className="size-5" />}
        </button>
      </form>

      <button
        onClick={() => setMode((m) => (m === 'in' ? 'up' : 'in'))}
        className="mt-5 text-center text-sm text-muted-foreground"
      >
        {mode === 'in' ? (
          <>
            ¿No tenés cuenta? <span className="font-semibold text-primary">Registrate</span>
          </>
        ) : (
          <>
            ¿Ya tenés cuenta? <span className="font-semibold text-primary">Iniciá sesión</span>
          </>
        )}
      </button>
    </div>
  )
}

function OnboardingScreen({ onDone, session }: { onDone: () => void, session?: any }) {
  const [mode, setMode] = useState<OnboardMode | null>(null)
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return
    setLoading(true)
    setError(null)
    
    const inviteCode = generateCode()
    
    // 1. Create household
    const { data: hh, error: hhErr } = await supabase.from('households').insert({
      name,
      invite_code: inviteCode
    }).select().single()

    if (hhErr || !hh) {
      setError(hhErr?.message || 'Error al crear hogar')
      setLoading(false)
      return
    }

    // 2. Add current user to members
    const { error: memErr } = await supabase.from('members').insert({
      user_id: session.user.id,
      household_id: hh.id,
      name: session.user.email?.split('@')[0] || 'Miembro',
      initials: (session.user.email?.substring(0, 2) || 'MI').toUpperCase(),
      color: `oklch(${Math.random() * 0.4 + 0.4} ${Math.random() * 0.1 + 0.1} ${Math.random() * 360})`,
      online: true
    })

    if (memErr) {
      setError(memErr.message)
      setLoading(false)
      return
    }

    // 3. Create default locations
    await supabase.from('locations').insert([
      { household_id: hh.id, name: 'Heladera', icon: 'fridge' },
      { household_id: hh.id, name: 'Alacena', icon: 'pantry' },
      { household_id: hh.id, name: 'Baño', icon: 'bath' },
      { household_id: hh.id, name: 'Lavadero', icon: 'laundry' }
    ])

    setLoading(false)
    onDone() // Triggers re-render in page.tsx which will load AppShell
  }

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return
    setLoading(true)
    setError(null)

    // 1. Find household by code
    const { data: hh, error: hhErr } = await supabase.from('households').select('id').eq('invite_code', code).single()

    if (hhErr || !hh) {
      setError('Código inválido o hogar no encontrado')
      setLoading(false)
      return
    }

    // 2. Add user to members
    const { error: memErr } = await supabase.from('members').insert({
      user_id: session.user.id,
      household_id: hh.id,
      name: session.user.email?.split('@')[0] || 'Miembro',
      initials: (session.user.email?.substring(0, 2) || 'MI').toUpperCase(),
      color: `oklch(${Math.random() * 0.4 + 0.4} ${Math.random() * 0.1 + 0.1} ${Math.random() * 360})`,
      online: true
    })

    if (memErr) {
      setError(memErr.message)
      setLoading(false)
      return
    }

    setLoading(false)
    onDone()
  }

  return (
    <div className="flex flex-1 flex-col px-6 pb-8 pt-12">
      <Brand />
      <h1 className="mt-8 font-serif text-3xl font-bold leading-tight text-balance">
        {mode === null ? 'Sumate a un hogar' : mode === 'crear' ? 'Creá tu hogar' : 'Unite a un hogar'}
      </h1>
      <p className="mt-2 text-pretty text-muted-foreground leading-relaxed">
        {mode === null
          ? 'Compartí el inventario, las compras y los gastos con quienes viven con vos.'
          : mode === 'crear'
            ? 'Ponele un nombre para crear el hogar.'
            : 'Pedí el código de invitación a quien ya creó el hogar.'}
      </p>

      {error && (
        <div className="mt-4 rounded-xl bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {mode === null && (
        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={() => setMode('crear')}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
              <Home className="size-6" />
            </span>
            <span className="flex-1">
              <span className="block font-bold">Crear un hogar nuevo</span>
              <span className="block text-sm text-muted-foreground">Empezá de cero e invitá a tu familia</span>
            </span>
            <ArrowRight className="size-5 text-muted-foreground" />
          </button>
          <button
            onClick={() => setMode('unirse')}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-info/15 text-info">
              <Users className="size-6" />
            </span>
            <span className="flex-1">
              <span className="block font-bold">Unirme a un hogar</span>
              <span className="block text-sm text-muted-foreground">Con un código de invitación</span>
            </span>
            <ArrowRight className="size-5 text-muted-foreground" />
          </button>
        </div>
      )}

      {mode === 'crear' && (
        <form onSubmit={handleCreate} className="mt-8 flex flex-1 flex-col">
          <label className="mb-4 block">
            <span className="mb-1.5 block text-sm font-semibold">Nombre del hogar</span>
            <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Casa de los Fernández" className={inputCls} />
          </label>
          <div className="mt-auto flex flex-col gap-2 pt-8">
            <button type="submit" disabled={loading} className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary font-bold text-primary-foreground active:scale-[0.98] disabled:opacity-50">
              {loading ? <Loader2 className="size-5 animate-spin" /> : <Check className="size-5" />} Crear y entrar
            </button>
            <button type="button" onClick={() => setMode(null)} className="h-11 text-sm font-semibold text-muted-foreground">Volver</button>
          </div>
        </form>
      )}

      {mode === 'unirse' && (
        <form onSubmit={handleJoin} className="mt-8 flex flex-1 flex-col">
          <label className="mb-4 block">
            <span className="mb-1.5 block text-sm font-semibold">Código de invitación</span>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                required
                placeholder="HOGAR-7K3M"
                className={cn(inputCls, 'pl-11 font-mono tracking-widest uppercase')}
              />
            </div>
          </label>
          <div className="mt-auto flex flex-col gap-2 pt-8">
            <button type="submit" disabled={loading} className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary font-bold text-primary-foreground active:scale-[0.98] disabled:opacity-50">
              {loading ? <Loader2 className="size-5 animate-spin" /> : 'Unirme al hogar'} {!loading && <ArrowRight className="size-5" />}
            </button>
            <button type="button" onClick={() => setMode(null)} className="h-11 text-sm font-semibold text-muted-foreground">Volver</button>
          </div>
        </form>
      )}
    </div>
  )
}
