import {
  ADD_ONS,
  HOME_TYPES,
  PACKAGES,
  PROPERTY_STATUS,
  RENOVATION_PREP,
  ROOM_ITEMS,
} from '@/constants/estimateConfig.js';

// Pure estimate maths, shared by the wizard and /api/estimates (which
// recalculates from the raw selection so a tampered browser can't change
// what gets saved or emailed).

export const findHome = (id) => HOME_TYPES.find((h) => h.id === id);
export const findPackage = (id) => PACKAGES.find((p) => p.id === id);
export const findStatus = (id) => PROPERTY_STATUS.find((s) => s.id === id);

// Starting quantities for a home type: { kitchen: 1, wardrobe: 2, ... }.
export function defaultRooms(homeId) {
  const home = findHome(homeId) || HOME_TYPES[1];
  return Object.fromEntries(ROOM_ITEMS.map((item) => [item.id, item.default(home)]));
}

export function defaultAddOns() {
  return Object.fromEntries(ADD_ONS.map((a) => [a.id, a.defaultOn]));
}

// Ranges are rounded outward to the nearest ₹5,000 so they read as the
// estimates they are.
const STEP = 5000;
const roundDown = (n) => Math.floor(n / STEP) * STEP;
const roundUp = (n) => Math.ceil(n / STEP) * STEP;

// selection: { home, status, rooms: { id: qty }, addOns: { id: bool } }
// Returns { lines: [{ label, detail, low, high }], low, high } for a package.
export function calculateEstimate(selection, packageId) {
  const home = findHome(selection.home);
  if (!home || !findPackage(packageId)) return { lines: [], low: 0, high: 0 };
  const lines = [];

  for (const item of ROOM_ITEMS) {
    const qty = Math.max(0, Math.min(item.max, Math.floor(Number(selection.rooms?.[item.id]) || 0)));
    if (!qty) continue;
    const [lo, hi] = item.rates[packageId];
    lines.push({ label: item.label, detail: qty > 1 ? `× ${qty}` : '', low: lo * qty, high: hi * qty });
  }

  for (const addOn of ADD_ONS) {
    if (!selection.addOns?.[addOn.id]) continue;
    const sqft = Math.round(home.area * addOn.areaFactor);
    const [lo, hi] = addOn.rates[packageId];
    lines.push({ label: addOn.label, detail: `~${sqft.toLocaleString('en-IN')} sq ft`, low: lo * sqft, high: hi * sqft });
  }

  if (selection.status === 'renovation') {
    const [lo, hi] = RENOVATION_PREP.rates[packageId];
    lines.push({ label: RENOVATION_PREP.label, detail: `~${home.area.toLocaleString('en-IN')} sq ft`, low: lo * home.area, high: hi * home.area });
  }

  const rounded = lines.map((l) => ({ ...l, low: roundDown(l.low), high: roundUp(l.high) }));
  return {
    lines: rounded,
    low: rounded.reduce((s, l) => s + l.low, 0),
    high: rounded.reduce((s, l) => s + l.high, 0),
  };
}

// ₹4,25,000 -> "₹4.25 L"; under a lakh -> "₹85,000".
export function formatInr(amount) {
  if (amount >= 100000) {
    const lakh = amount / 100000;
    return `₹${lakh.toFixed(lakh >= 10 ? 1 : 2).replace(/\.?0+$/, '')} L`;
  }
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export const formatRange = (low, high) => `${formatInr(low)} – ${formatInr(high)}`;

// Plain-text summary: saved on the quote for the admin panel and used in
// the WhatsApp message.
export function estimateSummary(selection, packageId, estimate) {
  const home = findHome(selection.home);
  const status = findStatus(selection.status);
  const pkg = findPackage(packageId);
  return [
    `${home?.label} · ${status?.label} · ${selection.city}${selection.locality ? ` (${selection.locality})` : ''}`,
    `${pkg?.name} package: ${formatRange(estimate.low, estimate.high)}`,
    '',
    ...estimate.lines.map((l) => `• ${l.label}${l.detail ? ` ${l.detail}` : ''}: ${formatRange(l.low, l.high)}`),
  ].join('\n');
}
