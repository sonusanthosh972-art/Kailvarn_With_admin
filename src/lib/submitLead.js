// Sends a public form (quote / consultation / contact) to its API route.
// Returns { ok: true } or { ok: false, message, fields }.
export async function submitLead(endpoint, data) {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json().catch(() => null);
    if (res.ok && json?.ok) return { ok: true };
    return {
      ok: false,
      message: json?.error?.message || 'We could not send your request. Please try again, or call/WhatsApp 8460150027.',
      fields: json?.error?.fields || {},
    };
  } catch {
    return { ok: false, message: 'No internet connection? Please try again, or call/WhatsApp 8460150027.', fields: {} };
  }
}
