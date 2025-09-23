'use client'

import React from 'react'

export const LogLineTitle = ({
  children,
}: {
  children: React.ReactNode
}) => (
  <h1 className="text-2xl font-bold text-white mb-4">{children}</h1>
)