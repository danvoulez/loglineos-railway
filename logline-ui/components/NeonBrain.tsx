'use client'

import React from 'react'

/**
 * Ícone animado e label para status do núcleo computável (cérebro neon).
 * Props:
 * - status: estado do núcleo ('idle', 'registering', 'active', 'ghost', 'error')
 */
export interface NeonBrainProps {
  status: 'idle' | 'registering' | 'active' | 'ghost' | 'error'
}

/** Helper para selecionar label e cor conforme status */
const STATUS_CONFIG: Record<
  NeonBrainProps['status'],
  { label: string; color: string }
> = {
  idle: { label: 'Aguardando...', color: 'text-white' },
  registering: { label: 'Detectando sensores...', color: 'text-neonYellow' },
  active: { label: 'Identidade validada!', color: 'text-neonGreen' },
  ghost: { label: 'Modo Ghost', color: 'text-neonPink' },
  error: { label: 'Erro computável', color: 'text-neonRed' },
}

export const NeonBrain: React.FC<NeonBrainProps> = ({ status }) => {
  const { label, color } = STATUS_CONFIG[status]
  // Substitua pelo SVG real do cérebro neon se houver
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-16 h-16 rounded-full bg-black border-4 ${color} flex items-center justify-center shadow-lg animate-pulse`}>
        {/* SVG/Ícone do cérebro neon pode ser inserido aqui */}
        <span className="text-2xl font-bold">🧠</span>
      </div>
      <span className={`font-bold ${color}`}>{label}</span>
    </div>
  )
}