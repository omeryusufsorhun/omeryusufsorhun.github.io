import { useState, type FormEvent } from 'react'
import emailjs from '@emailjs/browser'
import './ContactForm.css'

const SERVICE_ID = 'service_sjuqhqv'
const TEMPLATE_ID = 'template_rt05gzl'
const PUBLIC_KEY = '4y53nE57BGeNERzC4'
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    // Honeypot: a real person never sees this field, so anything in it is a bot.
    if (String(data.get('company') ?? '').trim() !== '') return

    const email = String(data.get('email') ?? '').trim()
    if (!EMAIL.test(email)) {
      setError('Please enter a valid email address.')
      setStatus('error')
      return
    }

    setError('')
    setStatus('sending')
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: String(data.get('name') ?? '').trim(),
          email_id: email,
          message: String(data.get('message') ?? '').trim(),
        },
        { publicKey: PUBLIC_KEY },
      )
      setStatus('sent')
      form.reset()
    } catch {
      setError('Sending failed. Reach me on LinkedIn instead.')
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="section">
      <h2 className="label">contact</h2>
      <form className="contact" onSubmit={onSubmit} noValidate>
        <label htmlFor="contact-name">name</label>
        <input id="contact-name" name="name" type="text" required />

        <label htmlFor="contact-email">email</label>
        <input id="contact-email" name="email" type="email" required />

        <label htmlFor="contact-message">message</label>
        <textarea id="contact-message" name="message" rows={5} required />

        <input
          className="honeypot"
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <button type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'sending…' : 'send'}
        </button>

        {status === 'error' && <p role="alert">{error}</p>}
        {status === 'sent' && <p role="status">Message sent. I will get back to you.</p>}
      </form>
      <p className="contact-links">
        <a href="https://github.com/omeryusufsorhun">github</a>
        <a href="https://linkedin.com/in/omeryusufsorhun">linkedin</a>
      </p>
    </section>
  )
}
