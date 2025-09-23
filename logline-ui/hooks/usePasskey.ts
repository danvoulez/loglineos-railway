import { useState } from 'react'

// Hook para autenticação via Passkey/WebAuthn
export function usePasskey() {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  const authenticate = async () => {
    setStatus('pending')
    try {
      // Simulação de autenticação WebAuthn (substitua por chamada real)
      await new Promise((resolve) => setTimeout(resolve, 1200))
      setResult({ id: 'logline-id://dan.voulezvous.ts.net' })
      setStatus('success')
    } catch (err: any) {
      setError('Falha na autenticação')
      setStatus('error')
    }
  }

  return { status, error, result, authenticate }
}