// Funções para detecção de sensores computáveis

export type Sensors = {
  passkey: boolean
  camera: boolean
  nfc: boolean
  mic: boolean
}

export function detectSensors(): Sensors {
  // Mock: randomiza sensores para simulação
  return {
    passkey: Math.random() > 0.1,
    camera: Math.random() > 0.5,
    nfc: Math.random() > 0.8,
    mic: Math.random() > 0.2,
  }
}

export function sensorLabel(sensor: keyof Sensors): string {
  switch (sensor) {
    case 'passkey':
      return 'Passkey/WebAuthn'
    case 'camera':
      return 'Câmera'
    case 'nfc':
      return 'NFC'
    case 'mic':
      return 'Microfone'
    default:
      return ''
  }
}