'use client'

import React from 'react'

interface LogLineCardProps {
  children: React.ReactNode
  className?: string
}

export const LogLineCard: React.FC<LogLineCardProps> = ({
  children,
  className = '',
}) => (
  <div
    className={`rounded-3xl bg-[#131313] border border-white/10 shadow-lg p-6 ${className}`}
  >
    {children}
  </div>
)