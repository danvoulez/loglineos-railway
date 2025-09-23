'use client'

import { useFormStatus } from 'react-dom'
import { LogLineButton } from './LogLineButton'

export const SubmitButton = ({ children }: { children: React.ReactNode }) => {
  const { pending } = useFormStatus()

  return (
    <LogLineButton type="submit" disabled={pending}>
      {pending ? 'Enviando...' : children}
    </LogLineButton>
  )
}