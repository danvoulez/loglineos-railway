'use client'

import React from 'react'
import { AuthLayout } from '../layouts/AuthLayout'
import { AuthCard } from '../components/AuthCard'

export default function TermsPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <h2 className="text-lg font-bold mb-4">Termos de uso LogLine ID</h2>
        <ul className="list-disc ml-5 mb-4">
          <li>Seus dados computáveis são protegidos e auditados em spans.</li>
          <li>O modo ghost permite anonimato computável sem associação de spans.</li>
          <li>Consentimento computável é obrigatório para uso.</li>
        </ul>
        <p>
          Para dúvidas, acesse <a href="https://logline.foundation" target="_blank" className="text-neonPink underline">LogLine Foundation</a>.
        </p>
      </AuthCard>
    </AuthLayout>
  )
}