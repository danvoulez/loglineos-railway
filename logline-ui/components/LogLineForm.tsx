'use client'

import React from 'react'

export const LogLineForm = ({
  children,
  ...props
}: React.FormHTMLAttributes<HTMLFormElement>) => (
  <form {...props} className="flex flex-col gap-6 w-full max-w-md mx-auto">
    {children}
  </form>
)