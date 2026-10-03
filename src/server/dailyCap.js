import 'server-only';

// Simple in-memory daily call counter. Prevents overnight bill shock: once a
// route exceeds its configured daily cap, further requests are rejected until
// the next calendar day (server time). Resets on restart, which is fine —
// this is a safety net, not an accounting system.
//
// Usage:
//   if (isDailyCapReached('redesign-room', 200)) return tooManyResponse();

const counters = new Map();

/**
 * Increment and check whether `key` has exceeded `maxPerDay` calls today.
 * Returns `true` if the cap has been reached (caller should reject).
 */
export function isDailyCapReached(key, maxPerDay) {
  const today = new Date().toISOString().slice(0, 10); // "2026-10-03"
  const id = `${key}:${today}`;
  const count = (counters.get(id) || 0) + 1;
  counters.set(id, count);

  // Purge stale entries from previous days.
  for (const k of counters.keys()) {
    if (!k.endsWith(today)) counters.delete(k);
  }

  return count > maxPerDay;
}

/** Current count for a key today (useful for logging). */
export function dailyCount(key) {
  const today = new Date().toISOString().slice(0, 10);
  return counters.get(`${key}:${today}`) || 0;
}
