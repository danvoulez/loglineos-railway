
'use client'
import React from 'react'

interface Props {
  id: string
  onCopy?: () => void
}

export function LogLineIDBadge({ id, onCopy }: Props) {
  return (
    <div className="glass-surface rounded p-6 neon-border--blue" style={{ borderWidth: 2 }}>
      <div className="text-secondary text-sm">LogLine ID</div>
      <div className="text-neonBlue font-bold text-xl" style={{ textShadow: '0 0 8px rgba(0,200,255,.8)' }}>{id}</div>
      <button
        onClick={onCopy}
        className="mt-10"
        style={{
          background: 'transparent',
          color: 'var(--neon-blue)',
          border: '2px solid var(--neon-blue)',
          borderRadius: 'var(--radius)',
          padding: '10px 16px',
          fontWeight: 700,
          boxShadow: '0 0 10px rgba(0,200,255,.6)',
          cursor: 'pointer'
        }}
      >
        Copiar
      </button>
    </div>
  )
}
