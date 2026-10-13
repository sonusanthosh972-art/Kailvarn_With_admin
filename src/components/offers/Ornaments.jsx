// Gold line ornaments for the Diwali banner.
const GOLD = '#E9B949';

// Round mandala medallion that caps each end of the offer plaque.
export function Mandala({ className = '' }) {
  const outer = Array.from({ length: 16 }, (_, i) => i * 22.5);
  const inner = Array.from({ length: 8 }, (_, i) => i * 45 + 22.5);
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="#4A0A0D" stroke={GOLD} strokeWidth="1.6" />
      <circle cx="50" cy="50" r="43" fill="none" stroke={GOLD} strokeWidth="0.7" strokeDasharray="1.5 2.5" />
      {outer.map((a) => (
        <g key={a} transform={`rotate(${a} 50 50)`}>
          <path d="M50 10c4 6 4 14 0 20-4-6-4-14 0-20Z" fill="none" stroke={GOLD} strokeWidth="1" />
          <circle cx="50" cy="8.5" r="1.1" fill={GOLD} />
        </g>
      ))}
      <circle cx="50" cy="50" r="20" fill="#5E0E12" stroke={GOLD} strokeWidth="1.1" />
      {inner.map((a) => (
        <path key={a} transform={`rotate(${a} 50 50)`} d="M50 32c3 4 3 9 0 13-3-4-3-9 0-13Z" fill={GOLD} opacity="0.85" />
      ))}
      <circle cx="50" cy="50" r="5" fill={GOLD} />
      <circle cx="50" cy="50" r="2.2" fill="#5E0E12" />
    </svg>
  );
}

// Filigree crest sitting on the plaque's top edge.
export function Crest({ className = '' }) {
  return (
    <svg viewBox="0 0 120 24" className={className} aria-hidden="true" fill="none" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round">
      <path d="M60 2l7 10-7 10-7-10 7-10Z" fill="#7A1418" />
      <circle cx="60" cy="12" r="2" fill={GOLD} stroke="none" />
      <path d="M53 12c-6-6-14-6-18 0 4 5 10 5 13 1M67 12c6-6 14-6 18 0-4 5-10 5-13 1" />
      <path d="M35 12c-8 0-14-3-22-3M85 12c8 0 14-3 22-3" />
      <circle cx="10" cy="9" r="1.6" fill={GOLD} stroke="none" />
      <circle cx="110" cy="9" r="1.6" fill={GOLD} stroke="none" />
    </svg>
  );
}

// Scroll flourish beside "SPECIAL OFFER" (mirror it for the right side).
export function Scroll({ className = '' }) {
  return (
    <svg viewBox="0 0 90 30" className={className} aria-hidden="true" fill="none" stroke={GOLD} strokeWidth="1.3" strokeLinecap="round">
      <path d="M2 15h34" />
      <path d="M36 15c6 0 8-9 15-9 6 0 8 6 4 9-3 2-7 0-6-3" />
      <path d="M36 15c6 0 8 9 15 9 6 0 8-6 4-9" />
      <path d="M58 15c6-4 12-6 18-4 4 1 5 4 3 6-2 1-4 0-4-2" />
      <path d="M58 15c6 4 12 6 18 4" />
      <path d="M82 15l4-3 3 3-3 3-4-3Z" fill={GOLD} />
    </svg>
  );
}
