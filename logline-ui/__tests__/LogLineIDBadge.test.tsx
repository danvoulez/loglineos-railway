import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { LogLineIDBadge } from '../components/LogLineIDBadge'

describe('LogLineIDBadge', () => {
  it('renders with id', () => {
    const { getByText } = render(
      <LogLineIDBadge id="logline-id://dan.voulezvous.ts.net" onCopy={() => {}} />
    )
    expect(getByText('logline-id://dan.voulezvous.ts.net')).toBeInTheDocument()
  })
  it('calls onCopy when copy button is clicked', () => {
    const handleCopy = jest.fn()
    const { getByRole } = render(
      <LogLineIDBadge id="logline-id://dan.voulezvous.ts.net" onCopy={handleCopy} />
    )
    fireEvent.click(getByRole('button'))
    expect(handleCopy).toHaveBeenCalled()
  })
})