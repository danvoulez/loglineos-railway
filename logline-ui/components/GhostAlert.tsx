
'use client'
import React from 'react'

export const GhostAlert: React.FC = () => (
  <div className="rounded p-4" style={{ background: 'rgba(255,41,255,.12)', border: '2px solid var(--neon-pink)', boxShadow: '0 0 10px rgba(255,41,255,.6)'}}>
    <span className="font-bold text-neonPink">Ghost Mode ativo</span>
    <p className="text-neonPink text-sm">
      Seu LogLine ID está off. Dados computáveis não serão associados a spans.<br/>
      Você pode voltar ao modo autenticado a qualquer momento.
    </p>
  </div>
)
