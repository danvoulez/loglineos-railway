'use client'

import React from 'react'

export const LogLineText = ({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) => (
  <p className={`text-white/80 text-base ${className}`}>{children}</p>
)