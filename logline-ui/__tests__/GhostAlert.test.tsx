import React from 'react'
import { render } from '@testing-library/react'
import { GhostAlert } from '../components/GhostAlert'

describe('GhostAlert', () => {
  it('renders ghost message', () => {
    const { getByText } = render(<GhostAlert />)
    expect(getByText(/Ghost Mode ativo/i)).toBeInTheDocument()
  })
})