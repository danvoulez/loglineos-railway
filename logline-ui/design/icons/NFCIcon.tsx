'use client'

import React from 'react'

export const NFCIcon = ({ size = 32, color = '#00E6FF' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-label="NFC">
    <rect x="8" y="8" width="16" height="16" rx="8" fill={color} />
    <path d="M12 16a4 4 0 0 1 8 0" stroke="#131313" strokeWidth="2"/>
  </svg>
)