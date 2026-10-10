// Everything the online estimate calculator (/get-free-quote) knows: the
// questions it asks and the rates it prices with. Shared by the browser
// (live wizard) and the server (which recalculates every estimate itself
// before saving or emailing it), so a price change here updates both.
//
// ⚠️ RATES ARE STARTER VALUES — replace them with KailVarn's real rates
// before going live. All amounts are in rupees, as [low, high] ranges, per
// unit (or per sq ft where noted), excluding GST.

export const PACKAGES = [
  {
    id: 'essential',
    name: 'Essential',
    tagline: 'Smart, durable interiors on a sensible budget.',
    features: [
      'BWR plywood carcass, BWP near water',
      'Matte laminate finish',
      'Branded soft-close hinges & channels',
      'Standard handles and fittings',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'The best balance of style, finish and function.',
    popular: true,
    features: [
      'BWP marine plywood / HDHMR boards',
      'High-gloss laminate or acrylic shutters',
      'Hettich / Hafele soft-close hardware',
      'Profile handles, tandem drawers, loft units',
    ],
  },
  {
    id: 'luxe',
    name: 'Luxe',
    tagline: 'Designer finishes and premium hardware throughout.',
    features: [
      'BWP marine plywood throughout',
      'PU paint, veneer or glass shutters',
      'Hafele / Hettich premium fittings & lift-ups',
      'Concealed lighting and designer accessories',
    ],
  },
];

// Approximate carpet area per home type, used for area-based items
// (false ceiling, painting, renovation prep).
export const HOME_TYPES = [
  { id: '1bhk', label: '1 BHK', hint: 'Up to ~600 sq ft', bedrooms: 1, area: 550 },
  { id: '2bhk', label: '2 BHK', hint: '~750–1,000 sq ft', bedrooms: 2, area: 850 },
  { id: '3bhk', label: '3 BHK', hint: '~1,100–1,400 sq ft', bedrooms: 3, area: 1250 },
  { id: '4bhk', label: '4 BHK+', hint: '~1,500 sq ft and above', bedrooms: 4, area: 1650 },
  { id: 'villa', label: 'Villa / Bungalow', hint: 'Independent house', bedrooms: 4, area: 2400 },
];

export const PROPERTY_STATUS = [
  { id: 'new', label: 'New home', hint: 'Just got possession' },
  { id: 'renovation', label: 'Renovation', hint: 'Updating an existing home' },
];

export const LOCATIONS = ['Silvassa', 'Vapi', 'Daman', 'Bhilad', 'Other nearby'];

// Units the customer can add or remove. `default(home)` sets the starting
// quantity for the chosen home type.
export const ROOM_ITEMS = [
  {
    id: 'kitchen',
    label: 'Modular kitchen',
    hint: 'Cabinets, countertop, sink & fittings',
    max: 2,
    default: () => 1,
    rates: { essential: [120000, 160000], premium: [180000, 240000], luxe: [280000, 380000] },
  },
  {
    id: 'wardrobe',
    label: 'Wardrobe',
    hint: 'One per bedroom, with loft',
    max: 6,
    default: (home) => home.bedrooms,
    rates: { essential: [55000, 75000], premium: [85000, 110000], luxe: [130000, 170000] },
  },
  {
    id: 'bed',
    label: 'Bed with storage',
    hint: 'Queen / king with hydraulic storage',
    max: 6,
    default: () => 0,
    rates: { essential: [30000, 40000], premium: [45000, 60000], luxe: [70000, 95000] },
  },
  {
    id: 'tvUnit',
    label: 'TV unit',
    hint: 'Wall panel with storage',
    max: 4,
    default: () => 1,
    rates: { essential: [25000, 35000], premium: [40000, 55000], luxe: [65000, 90000] },
  },
  {
    id: 'crockery',
    label: 'Crockery unit',
    hint: 'Dining storage & display',
    max: 2,
    default: (home) => (home.bedrooms >= 2 ? 1 : 0),
    rates: { essential: [25000, 35000], premium: [40000, 55000], luxe: [60000, 80000] },
  },
  {
    id: 'study',
    label: 'Study unit',
    hint: 'Desk with shelves',
    max: 3,
    default: () => 0,
    rates: { essential: [20000, 30000], premium: [35000, 45000], luxe: [50000, 70000] },
  },
  {
    id: 'pooja',
    label: 'Pooja unit',
    hint: 'Mandir with storage',
    max: 2,
    default: (home) => (home.bedrooms >= 3 ? 1 : 0),
    rates: { essential: [15000, 25000], premium: [25000, 40000], luxe: [45000, 65000] },
  },
];

// Whole-home services, priced per sq ft of the home's approximate carpet
// area times `areaFactor` (e.g. walls are ~3.5x the floor area).
export const ADD_ONS = [
  {
    id: 'falseCeiling',
    label: 'False ceiling & lighting',
    hint: 'POP / gypsum with profile & cove lights',
    areaFactor: 0.6,
    defaultOn: true,
    rates: { essential: [85, 110], premium: [120, 150], luxe: [170, 220] },
  },
  {
    id: 'painting',
    label: 'Full home painting',
    hint: 'Putty, primer & 2 coats (Asian Paints / Dulux)',
    areaFactor: 3.5,
    defaultOn: true,
    rates: { essential: [18, 24], premium: [26, 34], luxe: [40, 55] },
  },
];

// Extra line added automatically for renovations (old finishes removed,
// wall repairs, electrical and plumbing changes), per sq ft of carpet area.
export const RENOVATION_PREP = {
  label: 'Civil work & site preparation',
  rates: { essential: [80, 120], premium: [100, 150], luxe: [130, 190] },
};

export const ESTIMATE_DISCLAIMER =
  'This is an approximate estimate based on typical room sizes. The final price depends on your exact measurements, design and material choices, and is fixed in a written agreement after a free site visit and 3D design. GST extra.';
