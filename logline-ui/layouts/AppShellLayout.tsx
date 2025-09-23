
'use client'
import React from 'react'
import { FooterLinks } from '../components/FooterLinks'

export const AppShellLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="py-6">
        <div className="container flex items-center justify-between">
          <span className="font-bold text-xl" style={{ color: 'var(--neon-green)', textShadow: '0 0 12px rgba(0,255,170,.8)'}}>LogLine ID</span>
          <div style={{ width: 18, height: 18, border: '2px solid var(--neon-green)', borderRadius: 9999, boxShadow: '0 0 10px rgba(0,255,170,.8)' }} />
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-4">{children}</main>
      <FooterLinks />
    </div>
  )
}
