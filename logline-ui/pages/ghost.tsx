'use client'

import React from 'react'
import { AuthLayout } from '../layouts/AuthLayout'
import { AuthCard } from '../components/AuthCard'
import { NeonBrain } from '../components/NeonBrain'
import { GhostAlert } from '../components/GhostAlert'

export default function GhostPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <NeonBrain status="ghost" />
        <GhostAlert />
      </AuthCard>
    </AuthLayout>
  )
}