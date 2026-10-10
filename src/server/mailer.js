import 'server-only';
import nodemailer from 'nodemailer';

// Outgoing email over SMTP. Configure in .env.local / Vercel env:
//   SMTP_HOST=smtp.gmail.com  SMTP_PORT=465
//   SMTP_USER=kailvarn0@gmail.com  SMTP_PASS=<Gmail app password>
//   MAIL_FROM="KailVarn <kailvarn0@gmail.com>"   (optional, defaults to SMTP_USER)
//   LEADS_NOTIFY_EMAIL=kailvarn0@gmail.com       (optional, team copy of each lead)
// Without SMTP_HOST/USER/PASS nothing is sent and sendMail() returns false,
// so forms keep working before email is set up.

let transporter;

export function isMailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransporter() {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT) || 465;
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

// Returns true if the message was accepted by the SMTP server. Never
// throws -- a mail failure must not lose the lead.
export async function sendMail({ to, subject, html, text, replyTo }) {
  if (!isMailConfigured() || !to) return false;
  try {
    await getTransporter().sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      text,
      replyTo,
    });
    return true;
  } catch (err) {
    console.error('[mail] send failed:', err?.message);
    return false;
  }
}

export const escapeHtml = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
