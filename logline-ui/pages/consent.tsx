'use client'

import React, { useState } from 'react'
import { AuthLayout } from '../layouts/AuthLayout'
import { AuthCard } from '../components/AuthCard'

export default function ConsentPage() {
  const [consent, setConsent] = useState(false)

  return (
    <AuthLayout>
      <AuthCard>
        <h2 className="text-lg font-bold mb-4">Consentimento computável</h2>
        <p>
          Para continuar, você precisa dar consentimento computável para uso do LogLine ID.
        </p>
        <label className="flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="accent-neonGreen"
          />
          <span>Eu consinto computavelmente</span>
        </label>
      </AuthCard>
    </AuthLayout>
  )
}