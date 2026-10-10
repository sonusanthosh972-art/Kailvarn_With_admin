import { col } from '@/server/db.js';
import { estimateInput } from '@/server/models.js';
import { fail, ok, rateLimit, readJson, serverError, validate } from '@/server/http.js';
import { escapeHtml, sendMail } from '@/server/mailer.js';
import { siteUrl } from '@/server/siteUrl.js';
import { PACKAGES, ESTIMATE_DISCLAIMER } from '@/constants/estimateConfig.js';
import { calculateEstimate, estimateSummary, findHome, findPackage, findStatus, formatRange } from '@/lib/estimate.js';
import { BUSINESS } from '@/lib/seo.js';

// POST /api/estimates — the online estimate calculator. Recalculates the
// estimate from the customer's choices, saves it as a quote request (so it
// shows in Admin → Quote Requests with the full breakdown), emails it to
// the customer and the team, and returns it for the results screen.
export async function POST(request) {
  if (rateLimit(request, { key: 'form:estimates', max: 5, windowMs: 10 * 60 * 1000 })) {
    return fail('Too many requests. Please try again in a few minutes, or call/WhatsApp 8460150027.', 429);
  }
  const body = await readJson(request);
  // Honeypot field: real visitors never fill it (hidden in the form).
  if (body && typeof body.website === 'string' && body.website.trim()) return ok({ id: null, estimates: {} }, 201);
  const { data, response } = validate(estimateInput, body);
  if (response) return response;

  const estimates = Object.fromEntries(PACKAGES.map((p) => [p.id, calculateEstimate(data, p.id)]));
  const chosen = estimates[data.package];
  if (!chosen.lines.length) return fail('Please choose at least one item to estimate.', 400);

  const home = findHome(data.home);
  const pkg = findPackage(data.package);
  const summary = estimateSummary(data, data.package, chosen);

  let id;
  try {
    const now = new Date();
    const { insertedId } = await (await col('quotes')).insertOne({
      name: data.name,
      phone: data.phone,
      email: data.email,
      city: data.locality ? `${data.city} — ${data.locality}` : data.city,
      service: 'Online Estimate',
      projectType: `${home.label} · ${findStatus(data.status).label}`,
      budget: `${formatRange(chosen.low, chosen.high)} (${pkg.name})`,
      contactMethod: data.whatsapp ? 'WhatsApp' : 'Either is Fine',
      source: '',
      message: summary,
      estimate: { selection: { home: data.home, status: data.status, rooms: data.rooms, addOns: data.addOns, package: data.package }, ...chosen },
      status: 'NEW',
      notes: '',
      createdAt: now,
      updatedAt: now,
    });
    id = String(insertedId);
  } catch (err) {
    return serverError(err, 'create estimate');
  }

  const html = estimateEmailHtml({ data, home, pkg, estimate: chosen });
  const [emailed] = await Promise.all([
    sendMail({
      to: data.email,
      subject: `Your KailVarn interior estimate: ${formatRange(chosen.low, chosen.high)}`,
      html,
      text: `Hi ${data.name},\n\nThank you for using the KailVarn estimate calculator.\n\n${summary}\n\n${ESTIMATE_DISCLAIMER}\n\nBook your free site visit & 3D design: ${siteUrl()}/book-consultation\nCall / WhatsApp: ${BUSINESS.phone}`,
      replyTo: BUSINESS.email,
    }),
    sendMail({
      to: process.env.LEADS_NOTIFY_EMAIL || BUSINESS.email,
      subject: `New online estimate: ${data.name} · ${home.label} · ${formatRange(chosen.low, chosen.high)}`,
      text: `${data.name}\n+91 ${data.phone}\n${data.email}\nWhatsApp updates: ${data.whatsapp ? 'yes' : 'no'}\n\n${summary}`,
      replyTo: data.email,
    }),
  ]);

  return ok({ id, estimates, emailed }, 201);
}

function estimateEmailHtml({ data, home, pkg, estimate }) {
  const rows = estimate.lines
    .map(
      (l) => `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;color:#222">${escapeHtml(l.label)}${l.detail ? ` <span style="color:#888">${escapeHtml(l.detail)}</span>` : ''}</td>
        <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;color:#222;text-align:right;white-space:nowrap">${escapeHtml(formatRange(l.low, l.high))}</td>
      </tr>`
    )
    .join('');
  return `<!doctype html><html><body style="margin:0;background:#F5F1E8;font-family:Arial,Helvetica,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F1E8;padding:24px 12px"><tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden">
      <tr><td style="background:#0B103B;padding:24px 28px;color:#fff">
        <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#F2B21B">KailVarn Interiors</div>
        <div style="font-size:22px;margin-top:6px">Your interior estimate</div>
      </td></tr>
      <tr><td style="padding:28px">
        <p style="margin:0 0 16px;font-size:15px;color:#333">Hi ${escapeHtml(data.name)},</p>
        <p style="margin:0 0 20px;font-size:15px;color:#333;line-height:1.6">Thank you for using our estimate calculator. Here is the estimate for your
          <strong>${escapeHtml(home.label)}</strong> in <strong>${escapeHtml(data.city)}</strong> with our <strong>${escapeHtml(pkg.name)}</strong> package.</p>
        <div style="background:#FBF6E9;border:1px solid #F2D58A;border-radius:10px;padding:18px 20px;margin-bottom:22px">
          <div style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#8A6A1C">Estimated cost</div>
          <div style="font-size:28px;font-weight:bold;color:#0B103B;margin-top:4px">${escapeHtml(formatRange(estimate.low, estimate.high))}</div>
        </div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
        <p style="margin:20px 0 0;font-size:12px;color:#777;line-height:1.6">${escapeHtml(ESTIMATE_DISCLAIMER)}</p>
        <div style="margin:26px 0 8px;text-align:center">
          <a href="${siteUrl()}/book-consultation" style="display:inline-block;background:#F2B21B;color:#0B103B;text-decoration:none;font-weight:bold;font-size:14px;letter-spacing:1px;text-transform:uppercase;padding:14px 26px;border-radius:8px">Book free site visit &amp; 3D design</a>
        </div>
        <p style="margin:18px 0 0;font-size:14px;color:#333;text-align:center">Questions? Call or WhatsApp <a href="tel:${BUSINESS.phone}" style="color:#8A6A1C;font-weight:bold">${escapeHtml(BUSINESS.phone)}</a></p>
      </td></tr>
    </table>
  </td></tr></table></body></html>`;
}
