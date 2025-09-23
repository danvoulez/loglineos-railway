
'use client'
import React from 'react'

export interface DeviceStatusProps {
  passkey?: 'ok' | 'off'
  camera?: 'ok' | 'off'
  nfc?: 'ok' | 'off'
  mic?: 'ok' | 'off'
}

const Pill = ({ label, ok }: { label: string, ok?: boolean }) => (
  <div
    className="rounded p-4"
    style={{
      border: '2px solid ' + (ok ? 'var(--neon-green)' : 'var(--neon-pink)'),
      color: ok ? 'var(--neon-green)' : 'var(--neon-pink)',
      textShadow: ok ? '0 0 6px rgba(0,255,170,.8)' : '0 0 6px rgba(255,41,255,.8)',
      background: 'transparent'
    }}
  >
    {label}: {ok ? 'OK' : 'OFF'}
  </div>
)

export function DeviceStatus({ passkey='ok', camera='ok', nfc='off', mic='ok' }: DeviceStatusProps) {
  return (
    <div className="flex gap-6 items-center">
      <Pill label="Passkey" ok={passkey==='ok'} />
      <Pill label="Câmera" ok={camera==='ok'} />
      <Pill label="NFC" ok={nfc==='ok'} />
      <Pill label="Mic" ok={mic==='ok'} />
    </div>
  )
}
