import React from 'react'
import { LogLineButton } from './LogLineButton'

export const AuthButtonRow: React.FC<{
  onPasskey: () => void
  onGhost: () => void
}> = ({ onPasskey, onGhost }) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <LogLineButton onClick={onPasskey} variant="primary">
        Entrar com Passkey
      </LogLineButton>
      <LogLineButton onClick={onGhost} variant="ghost">
        Entrar como Ghost
      </LogLineButton>
    </div>
  )
}