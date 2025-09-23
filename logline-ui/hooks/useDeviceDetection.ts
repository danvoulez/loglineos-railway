import { useEffect, useState } from 'react'

export function useDeviceDetection() {
  const [passkey, setPasskey] = useState<boolean>(false)
  const [camera, setCamera] = useState<boolean>(false)
  const [nfc, setNfc] = useState<boolean>(false)
  const [mic, setMic] = useState<boolean>(false)

  useEffect(() => {
    // Passkey/WebAuthn
    setPasskey(!!window.PublicKeyCredential)

    // Camera
    navigator.mediaDevices?.getUserMedia({ video: true })
      .then(() => setCamera(true))
      .catch(() => setCamera(false))

    // NFC (simples, mock, pois não há API Web universal)
    setNfc('NDEFReader' in window)

    // Microfone
    navigator.mediaDevices?.getUserMedia({ audio: true })
      .then(() => setMic(true))
      .catch(() => setMic(false))
  }, [])

  return { passkey, camera, nfc, mic }
}