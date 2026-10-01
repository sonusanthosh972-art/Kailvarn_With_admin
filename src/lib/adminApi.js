// Tiny client for the admin JSON APIs ({ ok, data } / { ok:false, error }).
// A 401 (expired/missing session) sends the admin back to the login page.
export async function adminApi(path, { method = 'GET', body, signal } = {}) {
  let res;
  try {
    res = await fetch(path, {
      method,
      signal,
      credentials: 'same-origin',
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    if (err?.name === 'AbortError') throw err;
    return { ok: false, error: { message: 'Network error — check your connection and try again.' } };
  }
  if (res.status === 401 && typeof window !== 'undefined' && !path.endsWith('/login')) {
    window.location.href = `/admin/login?next=${encodeURIComponent(window.location.pathname)}`;
    return { ok: false, error: { message: 'Session expired' } };
  }
  const json = await res.json().catch(() => null);
  return json || { ok: false, error: { message: `Unexpected response (${res.status})` } };
}

export function formatDate(value, withTime = true) {
  if (!value) return '—';
  const d = new Date(value);
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}) });
}

export function formatBytes(n) {
  if (!n && n !== 0) return '';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
