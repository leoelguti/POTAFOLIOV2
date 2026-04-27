import { useState } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { SITE_CONFIG } from '../../utils/constants';
import { api } from '../../utils/api';

/**
 * Strips HTML tags from a string (client-side sanitization).
 */
function stripHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '');
}

/**
 * Contact section with functional form and social links.
 * Inputs are sanitized before submission and constrained with maxLength.
 */
export default function Contact() {
  const sectionRef = useScrollReveal();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    // Strip HTML tags on input to prevent stored XSS
    const value = stripHtml(e.target.value);
    setForm((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    // Client-side validation
    const trimmed = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      message: form.message.trim(),
    };

    if (!trimmed.name || !trimmed.email || !trimmed.message) {
      setStatus('error');
      setErrorMsg('All fields are required.');
      return;
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email)) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    try {
      await api.sendMessage(trimmed);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
      // Only show safe, non-technical error messages
      const safeMsg = typeof err.message === 'string' && err.message.length < 200
        ? err.message
        : 'Failed to send message. Please try again.';
      setErrorMsg(safeMsg);
    }
  };

  return (
    <div className="sec" id="contact" ref={sectionRef}>
      <div className="eyebrow">Contact</div>
      <div className="contact-layout">
        <div className="cinfo">
          <div className="sh rev">
            Let's build<br />something great.
          </div>
          <p className="rev">
            Open to freelance projects, full-time roles, and interesting conversations.
            If you have an idea, I'd love to hear it.
          </p>
          <div className="c-links">
            <a href={`mailto:${SITE_CONFIG.email}`} className="clink rev">
              <div className="clink-ic">✉</div>
              {SITE_CONFIG.email}
            </a>
            <a href={SITE_CONFIG.github} className="clink rev" style={{ transitionDelay: '.07s' }} target="_blank" rel="noopener noreferrer">
              <div className="clink-ic">⬡</div>
              {SITE_CONFIG.github.replace('https://', '')}
            </a>
            <a href={SITE_CONFIG.linkedin} className="clink rev" style={{ transitionDelay: '.14s' }} target="_blank" rel="noopener noreferrer">
              <div className="clink-ic">in</div>
              {SITE_CONFIG.linkedin.replace('https://', '')}
            </a>
            <a href={SITE_CONFIG.twitter} className="clink rev" style={{ transitionDelay: '.21s' }} target="_blank" rel="noopener noreferrer">
              <div className="clink-ic">𝕏</div>
              @{SITE_CONFIG.twitter.split('/').pop()}
            </a>
          </div>
        </div>

        <div className="cform rev">
          {status === 'success' ? (
            <div className="form-success">
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✨</div>
              <div>Message sent successfully!</div>
              <p style={{ color: 'var(--muted2)', fontSize: '.85rem', marginTop: '.5rem' }}>
                I'll get back to you soon.
              </p>
              <button
                className="fsubmit"
                style={{ marginTop: '1.5rem', maxWidth: '200px', margin: '1.5rem auto 0' }}
                onClick={() => setStatus('idle')}
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div>
                <label className="flabel" htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  className="finput"
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  maxLength={100}
                  autoComplete="name"
                  required
                />
              </div>
              <div>
                <label className="flabel" htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  className="finput"
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={handleChange}
                  maxLength={100}
                  autoComplete="email"
                  required
                />
              </div>
              <div>
                <label className="flabel" htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  className="ftextarea"
                  name="message"
                  placeholder="Tell me about your project…"
                  value={form.message}
                  onChange={handleChange}
                  maxLength={2000}
                  required
                />
                <div style={{ textAlign: 'right', fontSize: '.72rem', color: 'var(--muted2)', marginTop: '.25rem' }}>
                  {form.message.length}/2000
                </div>
              </div>
              {status === 'error' && (
                <p style={{ color: 'var(--a3)', fontSize: '.82rem', marginBottom: '1rem', fontFamily: 'var(--mono)' }}>
                  {errorMsg}
                </p>
              )}
              <button className="fsubmit" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send Message →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
