
import React from 'react'
import styles from './NeonOutlineButton.module.pcss'

type Variant = 'green' | 'purple' | 'blue'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: React.ReactNode
}

export function NeonOutlineButton({ variant='green', children, className='', ...rest }: Props) {
  const palette = variant === 'purple' ? styles.purple : variant === 'blue' ? styles.blue : ''
  return (
    <button className={[styles.neon, palette, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </button>
  )
}
