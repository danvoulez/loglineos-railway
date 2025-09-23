import { useState } from 'react'

// Hook para identidade computável atual
export function useIdentity(defaultId: string = '') {
  const [id, setId] = useState(defaultId)
  const [ghost, setGhost] = useState(false)

  function setIdentity(newId: string) {
    setId(newId)
    setGhost(false)
  }

  function setGhostIdentity(newId: string) {
    setId(newId)
    setGhost(true)
  }

  return { id, ghost, setIdentity, setGhostIdentity }
}