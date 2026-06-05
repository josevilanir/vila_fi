import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'

// ── Mock useAuth ──────────────────────────────────────────────────────────────
const loginMock = vi.fn()

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ login: loginMock, isLoading: false }),
}))

const defaultProps = {
  onSuccess: vi.fn(),
  onSwitchToRegister: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('LoginForm', () => {
  describe('client-side validation', () => {
    it('shows a validation error for an invalid e-mail without calling login', async () => {
      const { container } = render(<LoginForm {...defaultProps} />)
      await userEvent.type(screen.getByPlaceholderText('seu@email.com'), 'not-an-email')
      await userEvent.type(screen.getByPlaceholderText('••••••••'), 'anypassword')
      // fireEvent.submit bypasses the browser's native HTML5 email validation
      // so React's onSubmit handler (and Zod) actually executes.
      fireEvent.submit(container.querySelector('form')!)
      const errorEl = await screen.findByText(/.+/i, { selector: 'p' })
      expect(errorEl).toBeInTheDocument()
      expect(loginMock).not.toHaveBeenCalled()
    })
  })

  describe('successful login', () => {
    it('calls login with correct credentials and invokes onSuccess', async () => {
      loginMock.mockResolvedValue(undefined)
      render(<LoginForm {...defaultProps} />)
      await userEvent.type(screen.getByPlaceholderText('seu@email.com'), 'a@b.com')
      await userEvent.type(screen.getByPlaceholderText('••••••••'), 'secret123')
      await userEvent.click(screen.getByRole('button', { name: /entrar/i }))
      await waitFor(() => expect(loginMock).toHaveBeenCalledWith('a@b.com', 'secret123'))
      expect(defaultProps.onSuccess).toHaveBeenCalledOnce()
    })
  })

  describe('failed login', () => {
    it('displays the error message returned by the service', async () => {
      loginMock.mockRejectedValue(new Error('E-mail ou senha inválidos'))
      render(<LoginForm {...defaultProps} />)
      await userEvent.type(screen.getByPlaceholderText('seu@email.com'), 'a@b.com')
      await userEvent.type(screen.getByPlaceholderText('••••••••'), 'wrongpass')
      await userEvent.click(screen.getByRole('button', { name: /entrar/i }))
      expect(await screen.findByText('E-mail ou senha inválidos')).toBeInTheDocument()
      expect(defaultProps.onSuccess).not.toHaveBeenCalled()
    })
  })

  describe('navigation', () => {
    it('calls onSwitchToRegister when the register link is clicked', async () => {
      render(<LoginForm {...defaultProps} />)
      await userEvent.click(screen.getByText(/criar conta/i))
      expect(defaultProps.onSwitchToRegister).toHaveBeenCalledOnce()
    })
  })
})
