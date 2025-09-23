import React from 'react'
import { render } from '@testing-library/react'
import { DeviceStatus } from '../components/DeviceStatus'

describe('DeviceStatus', () => {
  it('shows sensors status', () => {
    const { getByText } = render(
      <DeviceStatus passkey camera nfc mic />
    )
    expect(getByText('Passkey')).toHaveClass('text-neonGreen')
    expect(getByText('Câmera')).toHaveClass('text-neonPink')
    expect(getByText('NFC')).toHaveClass('text-neonBlue')
    expect(getByText('Mic')).toHaveClass('text-neonYellow')
  })
})