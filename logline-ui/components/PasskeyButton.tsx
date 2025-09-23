
import React from 'react'
import styles from './PasskeyButton.module.pcss'

interface PasskeyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'default' | 'create'
}

export function PasskeyButton({ children, variant='default', className='', ...rest }: PasskeyButtonProps) {
  return (
    <button className={[styles.neon, variant==='create' ? styles.purple : '', className].join(' ')} type="button" {...rest}>
      {children}
    </button>
  )
}
