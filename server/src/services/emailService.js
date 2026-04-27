import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM;
const emailTo = process.env.EMAIL_TO;

let resend = null;

/**
 * Returns true if email notifications are fully configured.
 */
export function isEmailConfigured() {
  return !!(apiKey && emailFrom && emailTo);
}

/**
 * Sends a notification email when a new contact message is received.
 * Fails silently — email delivery should never block the user response.
 *
 * @param {{ name: string, email: string, message: string }} contact
 */
export async function sendContactNotification({ name, email, message }) {
  if (!isEmailConfigured()) {
    console.log('📧 Email not configured — skipping notification');
    return;
  }

  if (!resend) {
    resend = new Resend(apiKey);
  }

  try {
    const { error } = await resend.emails.send({
      from: emailFrom,
      to: emailTo,
      subject: `📬 Nuevo mensaje de ${name} — Portafolio`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #e0e0e0; border-radius: 12px; overflow: hidden; border: 1px solid #1a1a2e;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #6c5ce7 0%, #a855f7 100%); padding: 32px 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 22px; color: #ffffff; font-weight: 600;">📬 Nuevo Mensaje</h1>
            <p style="margin: 8px 0 0; font-size: 13px; color: rgba(255,255,255,0.8);">Alguien te contactó desde tu portafolio</p>
          </div>

          <!-- Body -->
          <div style="padding: 28px 24px;">
            <!-- Sender info -->
            <div style="background: #111122; border-radius: 8px; padding: 16px; margin-bottom: 20px; border-left: 3px solid #6c5ce7;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; color: #888; font-size: 13px; width: 70px;">Nombre</td>
                  <td style="padding: 6px 0; color: #ffffff; font-size: 14px; font-weight: 500;">${escapeForEmail(name)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #888; font-size: 13px;">Email</td>
                  <td style="padding: 6px 0;">
                    <a href="mailto:${escapeForEmail(email)}" style="color: #a855f7; text-decoration: none; font-size: 14px;">${escapeForEmail(email)}</a>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Message -->
            <div style="background: #111122; border-radius: 8px; padding: 20px; border-left: 3px solid #00ff87;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Mensaje</p>
              <p style="margin: 0; color: #e0e0e0; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${escapeForEmail(message)}</p>
            </div>

            <!-- Reply button -->
            <div style="text-align: center; margin-top: 24px;">
              <a href="mailto:${escapeForEmail(email)}?subject=Re: Contacto desde Portafolio"
                 style="display: inline-block; background: linear-gradient(135deg, #6c5ce7, #a855f7); color: #fff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">
                Responder →
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="padding: 16px 24px; text-align: center; border-top: 1px solid #1a1a2e;">
            <p style="margin: 0; font-size: 11px; color: #555;">
              Enviado desde tu portafolio · ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('📧 Email send error:', error.message);
      return;
    }

    console.log(`📧 Notification email sent for message from ${name}`);
  } catch (err) {
    // Never throw — email failure should not affect the user's request
    console.error('📧 Email delivery failed:', err.message);
  }
}

/**
 * Escapes HTML special characters to prevent injection in email templates.
 */
function escapeForEmail(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
