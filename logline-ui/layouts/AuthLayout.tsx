'use client'

import React from 'react'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background">
      <main className="flex flex-col items-center w-full max-w-md mx-auto p-4">
        {children}
      </main>
    </div>
  )
}