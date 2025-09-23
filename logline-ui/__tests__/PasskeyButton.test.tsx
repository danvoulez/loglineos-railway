import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { PasskeyButton } from '../components/PasskeyButton'

describe('PasskeyButton', () => {
  it('renders with children', () => {
    const { getByText } = render(<PasskeyButton>Entrar</PasskeyButton>)
    expect(getByText('Entrar')).toBeInTheDocument()
  })
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    const { getByText } = render(
      <PasskeyButton onClick={handleClick}>Entrar</PasskeyButton>
    )
    fireEvent.click(getByText('Entrar'))
    expect(handleClick).toHaveBeenCalled()
  })
  it('is disabled', () => {
    const { getByRole } = render(<PasskeyButton disabled>Entrar</PasskeyButton>)
    expect(getByRole('button')).toBeDisabled()
  })
})