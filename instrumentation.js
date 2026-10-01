// Runs once when the Next.js server starts.
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // This server's IPv6 connectivity is broken: Google's DNS returns IPv6
    // addresses, but connecting to them fails. Trying IPv4 first keeps
    // outbound fetches (Gemini API calls) from stalling on a dead IPv6
    // route until Node's 10s connect timeout.
    const dns = await import('node:dns');
    dns.setDefaultResultOrder('ipv4first');
  }
}
