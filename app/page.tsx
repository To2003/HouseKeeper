'use client'

import { useEffect, useState } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { StoreProvider } from '@/components/store'
import { AuthFlow } from '@/components/auth/auth-flow'
import { AppShell } from '@/components/app-shell'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function Page() {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)
  const [hasHousehold, setHasHousehold] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      if (session) {
        const { data } = await supabase.from('members').select('household_id').eq('user_id', session.user.id).single()
        if (data?.household_id) setHasHousehold(true)
      }
      setLoading(false)
    }
    
    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession)
      if (newSession) {
        const { data } = await supabase.from('members').select('household_id').eq('user_id', newSession.user.id).single()
        if (data?.household_id) setHasHousehold(true)
        else setHasHousehold(false)
      } else {
        setHasHousehold(false)
      }
      setLoading(false)
    })

    return () => authListener.subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <ThemeProvider>
      {session && hasHousehold ? (
        <StoreProvider session={session}>
          <AppShell />
        </StoreProvider>
      ) : (
        <AuthFlow 
          session={session} 
          onDone={() => setHasHousehold(true)} 
        />
      )}
    </ThemeProvider>
  )
}
