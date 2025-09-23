
'use client'
import React from 'react'

interface LogLineInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function LogLineInput({ label, error, className='', ...props }: LogLineInputProps) {
  return (
    <div className={['flex flex-col gap-4', className].join(' ')}>
      {label && <label className="text-secondary">{label}</label>}
      <input
        {...props}
        className="rounded px-4 py-3 border"
        style={{
          background: 'transparent',
          color: 'var(--text-primary)',
          borderColor: 'var(--neon-green)',
          boxShadow: '0 0 8px rgba(0,255,170,.25)',
        }}
        onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 20px rgba(0,255,170,.85)'}}
        onBlur={(e) => { e.currentTarget.style.boxShadow = '0 0 8px rgba(0,255,170,.25)'}}
      />
      {error && <span className="text-neonPink text-sm">{error}</span>}
    </div>
  )
}
