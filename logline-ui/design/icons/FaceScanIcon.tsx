'use client'

import React from 'react'

export const FaceScanIcon = ({ size = 32, color = '#FF29FF' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-label="Face Scan">
    <rect x="6" y="6" width="20" height="20" rx="6" fill={color} />
    <circle cx="16" cy="16" r="6" fill="#131313" />
    <circle cx="16" cy="16" r="2" fill={color} />
  </svg>
)