import { useState } from 'react'

// Hook para alternar modo Ghost (identidade efêmera)
export function useGhostMode(initial = false) {
  const [ghost, setGhost] = useState(initial)

  function activateGhost() {
    setGhost(true)
  }

  function deactivateGhost() {
    setGhost(false)
  }

  return { ghost, activateGhost, deactivateGhost }
}