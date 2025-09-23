'use client'

import React from 'react'

export const MicIcon = ({ size = 32, color = '#FFD600' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-label="Mic">
    <rect x="12" y="8" width="8" height="14" rx="4" fill={color} />
    <rect x="14" y="24" width="4" height="3" rx="2" fill={color} />
    <path d="M16 27v3" stroke="#131313" strokeWidth="2"/>
  </svg>
)