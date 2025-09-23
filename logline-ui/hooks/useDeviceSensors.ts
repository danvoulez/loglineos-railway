import { useState } from 'react'

// Hook para detectar sensores do dispositivo (mock)
export function useDeviceSensors() {
  const [sensors, setSensors] = useState({
    passkey: true,
    camera: false,
    nfc: false,
    mic: true,
  })

  // Simular detecção dinâmico (exemplo)
  function detectSensors() {
    setSensors({
      passkey: Math.random() > 0.2,
      camera: Math.random() > 0.5,
      nfc: Math.random() > 0.7,
      mic: Math.random() > 0.3,
    })
  }

  return { sensors, detectSensors }
}