'use client'

import React from 'react'

export const LogLineGhostIcon = ({
  size = 32,
}: {
  size?: number
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    aria-label="Ghost"
  >
    <circle cx="16" cy="16" r="16" fill="#fff" />
    <ellipse cx="16" cy="20" rx="8" ry="3" fill="#131313" />
    <circle cx="12" cy="15" r="2" fill="#131313" />
    <circle cx="20" cy="15" r="2" fill="#131313" />
  </svg>
)