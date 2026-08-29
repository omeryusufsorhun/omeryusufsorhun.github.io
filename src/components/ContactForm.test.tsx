import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactForm from './ContactForm'

const send = vi.fn()

vi.mock('@emailjs/browser', () => ({
  default: {
    init: vi.fn(),
    send: (...args: unknown[]) => send(...args),
  },
}))

describe('ContactForm', () => {
  beforeEach(() => {
    send.mockReset()
    send.mockResolvedValue({ status: 200 })
  })

  it('refuses to send when the email is malformed', async () => {
    render(<ContactForm />)
    await userEvent.type(screen.getByLabelText(/name/i), 'A Recruiter')
    await userEvent.type(screen.getByLabelText(/email/i), 'not-an-email')
    await userEvent.type(screen.getByLabelText(/message/i), 'hello')
    await userEvent.click(screen.getByRole('button', { name: /send/i }))

    expect(send).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent(/valid email/i)
  })

  it('sends a valid message and confirms it', async () => {
    render(<ContactForm />)
    await userEvent.type(screen.getByLabelText(/name/i), 'A Recruiter')
    await userEvent.type(screen.getByLabelText(/email/i), 'someone@example.com')
    await userEvent.type(screen.getByLabelText(/message/i), 'hello')
    await userEvent.click(screen.getByRole('button', { name: /send/i }))

    expect(send).toHaveBeenCalledTimes(1)
    expect(await screen.findByRole('status')).toHaveTextContent(/message sent/i)
  })

  it('silently drops a submission when the honeypot is filled', async () => {
    const { container } = render(<ContactForm />)
    const honeypot = container.querySelector<HTMLInputElement>('input[name="company"]')!

    await userEvent.type(screen.getByLabelText(/name/i), 'Spam Bot')
    await userEvent.type(screen.getByLabelText(/email/i), 'bot@example.com')
    await userEvent.type(screen.getByLabelText(/message/i), 'buy things')
    await userEvent.type(honeypot, 'ACME')
    await userEvent.click(screen.getByRole('button', { name: /send/i }))

    expect(send).not.toHaveBeenCalled()
  })
})
