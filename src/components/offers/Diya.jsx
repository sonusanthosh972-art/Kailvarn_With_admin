// Red clay diya with a gold rim and a flickering flame. Gradient ids are
// fixed, so render it at most once per page.
export default function Diya({ className = '', style }) {
  return (
    <svg viewBox="0 0 80 64" className={className} style={style} aria-hidden="true">
      <defs>
        <radialGradient id="kv-diya-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE08A" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#FFB020" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#FF8A00" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="kv-diya-flame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFBEA" />
          <stop offset="40%" stopColor="#FFD54A" />
          <stop offset="100%" stopColor="#F26B1D" />
        </linearGradient>
        <linearGradient id="kv-diya-bowl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E0531F" />
          <stop offset="55%" stopColor="#B32A12" />
          <stop offset="100%" stopColor="#6E1208" />
        </linearGradient>
      </defs>
      <circle className="kv-halo" cx="40" cy="22" r="22" fill="url(#kv-diya-halo)" />
      <path className="kv-flame" d="M40 4c4.5 6.5 7.5 11 7.5 16a7.5 7.5 0 0 1-15 0c0-5 3-9.5 7.5-16Z" fill="url(#kv-diya-flame)" />
      {/* bowl with a pointed spout on the right */}
      <path d="M8 36h56l10-5c-2 6-6 9-11 10-4 10-12 15-23 15S20 50 16 41c-4-1-7-3-8-5Z" fill="url(#kv-diya-bowl)" />
      <path d="M8 36h56l10-5" fill="none" stroke="#F6D47C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 45c6 3 14 4 20 4s14-1 20-4" fill="none" stroke="#F2B21B" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M26 50c4 1.5 9 2 14 2s10-.5 14-2" fill="none" stroke="#F2B21B" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}
