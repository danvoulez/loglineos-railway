import React from 'react'
import { render } from '@testing-library/react'
import { NeonBrain } from '../components/NeonBrain'

describe('NeonBrain', () => {
  it('shows idle label', () => {
    const { getByText } = render(<NeonBrain status="idle" />)
    expect(getByText('Aguardando...')).toBeInTheDocument()
  })
  it('shows registering label', () => {
    const { getByText } = render(<NeonBrain status="registering" />)
    expect(getByText('Detectando sensores...')).toBeInTheDocument()
  })
  it('shows active label', () => {
    const { getByText } = render(<NeonBrain status="active" />)
    expect(getByText('Identidade validada!')).toBeInTheDocument()
  })
  it('shows ghost label', () => {
    const { getByText } = render(<NeonBrain status="ghost" />)
    expect(getByText('Modo Ghost')).toBeInTheDocument()
  })
  it('shows error label', () => {
    const { getByText } = render(<NeonBrain status="error" />)
    expect(getByText('Erro computável')).toBeInTheDocument()
  })
})