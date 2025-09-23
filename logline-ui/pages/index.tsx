
'use client'
import React from 'react'
import { AppShellLayout } from '../layouts/AppShellLayout'
import { LogLineIDBadge } from '../components/LogLineIDBadge'
import { NeonBrain } from '../components/NeonBrain'
import { DeviceStatus } from '../components/DeviceStatus'
import { NeonOutlineButton } from '../components/NeonOutlineButton'
import { useIdentity } from '../hooks/useIdentity'
import { useDeviceSensors } from '../hooks/useDeviceSensors'

export default function HomePage() {
  const { id } = useIdentity('logline-id://dan.voulezvous.ts.net')
  const { sensors } = useDeviceSensors()

  return (
    <AppShellLayout>
      <section className="flex flex-col items-center gap-8 mt-10">
        <NeonBrain status="active" />
        <LogLineIDBadge id={id} onCopy={() => navigator.clipboard.writeText(id)} />
        <DeviceStatus {...sensors} />
        <div className="flex gap-6">
          <NeonOutlineButton>Entrar</NeonOutlineButton>
          <NeonOutlineButton variant="purple">Criar ID</NeonOutlineButton>
        </div>
      </section>
    </AppShellLayout>
  )
}
