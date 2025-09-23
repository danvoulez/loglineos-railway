// Mock para respostas de sensores (NFC, câmera, microfone...)
export const sensorResponses = [
  { type: 'passkey', detected: true, label: 'Passkey detectado' },
  { type: 'camera', detected: false, label: 'Câmera não detectada' },
  { type: 'nfc', detected: false, label: 'NFC não detectado' },
  { type: 'mic', detected: true, label: 'Microfone detectado' },
]