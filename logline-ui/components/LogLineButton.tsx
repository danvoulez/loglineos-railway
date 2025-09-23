'use client'

import React from 'react'

interface LogLineButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'danger'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export const LogLineButton: React.FC<LogLineButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false,
}) => {
  const base =
    'rounded-2xl px-5 py-2 font-medium text-sm transition-all focus:outline-none disabled:opacity-40 disabled:pointer-events-none'

  const styles = {
    primary: 'bg-white text-black hover:bg-[#eee]',
    ghost: 'border border-white text-white hover:bg-white hover:text-black',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]}`}
    >
      {children}
    </button>
  )
}