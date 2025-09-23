
'use client'
import React from 'react'

interface AuthCardProps { children: React.ReactNode }

export const AuthCard: React.FC<AuthCardProps> = ({ children }) => (
  <div
    className="glass-surface rounded p-6"
    style={{ borderWidth: 2, borderColor: 'var(--neon-purple)', boxShadow: '0 0 10px rgba(196,0,255,.6)' }}
  >
    {children}
  </div>
)
