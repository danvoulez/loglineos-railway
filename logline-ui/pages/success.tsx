import React from 'react'
import { AppShellLayout } from '../layout/AppShellLayout'
import { LogLineIDBadge } from '../components/LogLineIDBadge'

export default function SuccessPage() {
  return (
    <AppShellLayout>
      <h2 className="text-2xl font-bold mb-4">Bem-vindo!</h2>
      <LogLineIDBadge />
      <p className="mt-2 text-white/80">Sua identidade computável está ativa.</p>
    </AppShellLayout>
  )
}