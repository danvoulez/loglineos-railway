'use client'

import React from 'react'
import { AuthLayout } from '../layouts/AuthLayout'
import { AuthCard } from '../components/AuthCard'
import { NeonBrain } from '../components/NeonBrain'
import { PasskeyButton } from '../components/PasskeyButton'
import { usePasskey } from '../hooks/usePasskey'

export default function RegisterPage() {
  const { status, authenticate } = usePasskey()

  return (
    <AuthLayout>
      <AuthCard>
        <NeonBrain status={status === 'success' ? 'active' : status === 'error' ? 'error' : 'registering'} />
        <PasskeyButton variant="create" size="lg" onClick={authenticate} disabled={status === 'pending'}>
          {status === 'pending' ? 'Registrando...' : 'Criar LogLine ID'}
        </PasskeyButton>
      </AuthCard>
    </AuthLayout>
  )
}