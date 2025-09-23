'use client'

import React from 'react'

export const LogLinePasskeyIcon = ({
  size = 32,
}: {
  size?: number
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    aria-label="Passkey"
  >
    <rect x="8" y="12" width="16" height="8" rx="4" fill="#fff" />
    <circle cx="16" cy="16" r="2" fill="#131313" />
    <rect x="14" y="20" width="4" height="2" rx="1" fill="#fff" />
  </svg>
)