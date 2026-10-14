// Fixed links used by the advertisement and painting pages. The offer itself
// (on/off, discount, title, dates, text) is edited in Admin -> Advertisement
// and read with usePromo() from src/components/offers/PromoProvider.jsx.
export const DIWALI_OFFER = {
  quotePath: '/painting-quote',
  visualizerPath: '/paint-visualizer',
  consultationPath: '/paint-consultation',
};

// Hero photo, pre-sized from kailvarn-site/assets/img/Luxury Diwali Living Room Glow.png
export const DIWALI_HERO_IMAGE = {
  src: '/offers/diwali-living-room-1600.jpg',
  srcSet: '/offers/diwali-living-room-768.webp 768w, /offers/diwali-living-room-1280.webp 1280w, /offers/diwali-living-room-1920.webp 1920w',
};

// Painting quote wizard choices. `label` is what the team sees on the lead.
export const PAINT_HOMES = [
  { id: '1bhk', label: '1 BHK', hint: 'Up to ~600 sq ft' },
  { id: '2bhk', label: '2 BHK', hint: '~750–1,000 sq ft' },
  { id: '3bhk', label: '3 BHK', hint: '~1,100–1,400 sq ft' },
  { id: '4bhk', label: '4 BHK+', hint: '~1,500 sq ft and above' },
  { id: 'villa', label: 'Villa / Bungalow', hint: 'Independent house' },
  { id: 'shop', label: 'Shop / Office', hint: 'Commercial space' },
];
export const PAINT_SCOPES = [
  { id: 'interior', label: 'Interior walls', hint: 'Rooms, ceilings & passages' },
  { id: 'exterior', label: 'Exterior walls', hint: 'Outside walls & balcony' },
  { id: 'both', label: 'Interior + Exterior', hint: 'Complete home painting' },
];
// Painting quote: brand (step 3) -> that brand's interior range (step 4).
// tier: 'luxury' | 'premium' | 'mid' | 'economy' | 'decorative' | 'specialty'
export const PAINT_TIERS = {
  luxury: 'Luxury',
  premium: 'Premium',
  mid: 'Mid-range',
  economy: 'Economy',
  decorative: 'Designer / Textures',
  specialty: 'Specialty',
};

// Last option on every brand's range step.
export const PAINT_RANGE_HELP = { id: 'help', label: 'Help me choose', tier: '', examples: 'Our expert suggests the right range for your walls and budget at the site visit.' };

export const PAINT_BRANDS = [
  {
    id: 'asian-paints',
    label: 'Asian Paints',
    ranges: [
      { id: 'royale', label: 'Royale', tier: 'luxury', examples: 'Royale Luxury Emulsion, Royale Shyne, Royale Matt, Royale Aspira, Royale Glitz' },
      { id: 'apcolite', label: 'Apcolite', tier: 'premium', examples: 'Apcolite Premium Emulsion, Apcolite Advanced Shyne, Apcolite Satin' },
      { id: 'tractor', label: 'Tractor', tier: 'economy', examples: 'Tractor Sparc, Tractor Shyne' },
      { id: 'textures', label: 'Textures & special finishes', tier: 'decorative', examples: 'Royale Lustre and texture finishes' },
    ],
  },
  {
    id: 'berger',
    label: 'Berger',
    ranges: [
      { id: 'silk', label: 'Silk', tier: 'luxury', examples: 'Silk Glamor Dazzle, Silk Glamor High Sheen, Silk Glamor Soft Sheen, Silk Glamor Matt' },
      { id: 'easy-clean', label: 'Easy Clean', tier: 'premium', examples: 'Easy Clean, Easy Clean Fresh, Easy Clean Silky Touch' },
      { id: 'rangoli', label: 'Rangoli', tier: 'mid', examples: 'Rangoli Rich Matt, Rangoli Total Care' },
      { id: 'bison', label: 'Bison', tier: 'economy', examples: 'Bison Emulsion, Bison Glow, Bison Lite' },
      { id: 'glamart', label: 'Silk GlamArt', tier: 'decorative', examples: 'Metallica, Stucco, Vintage, Stone & Tones, Non-Metallic' },
    ],
  },
  {
    id: 'nerolac',
    label: 'Nerolac',
    ranges: [
      { id: 'impressions', label: 'Impressions', tier: 'luxury', examples: 'Impressions Kashmir, Impressions Ultra HD, Impressions HD, Impressions Sheen, Impressions Ultra Fresh' },
      { id: 'beauty-gold', label: 'Beauty Gold', tier: 'premium', examples: 'Beauty Gold Washable, Beauty Gold Washable NXT, Beauty Gold Washable Plus' },
      { id: 'beauty', label: 'Beauty', tier: 'mid', examples: 'Beauty Gold, Beauty Sheen, Beauty Smooth' },
      { id: 'little-master', label: 'Little Master', tier: 'economy', examples: 'Beauty Little Master, Beauty Little Master Sheen' },
      { id: 'designer', label: 'Special / Designer', tier: 'decorative', examples: 'Impressions Kashmir and other decorative / special-effect finishes' },
    ],
  },
  {
    id: 'dulux',
    label: 'Dulux',
    ranges: [
      { id: 'velvet-touch', label: 'Velvet Touch', tier: 'luxury', examples: 'Velvet Touch Eterna, Diamond Glo, Pearl Glo, Platinum Glo' },
      { id: 'superclean', label: 'SuperClean', tier: 'premium', examples: 'SuperClean, SuperClean 3in1' },
      { id: 'supercover', label: 'SuperCover', tier: 'mid', examples: 'SuperCover Ultra' },
      { id: 'promise', label: 'Promise', tier: 'economy', examples: 'Promise Interior, Promise Sheen Interior, Promise SmartChoice' },
      { id: 'better-living', label: 'Better Living', tier: 'specialty', examples: 'Better Living Air Clean Biobased' },
      { id: 'simply-refresh', label: 'Simply Refresh', tier: 'specialty', examples: 'Simply Refresh' },
    ],
  },
  {
    id: 'nippon',
    label: 'Nippon',
    ranges: [
      { id: 'aircare', label: 'AirCare VG', tier: 'luxury', examples: 'AirCare VG' },
      { id: 'satin-glo', label: 'Satin Glo', tier: 'luxury', examples: 'Satin Glo Prime, Satin Glo+, Satin Glo Aura' },
      { id: 'spotless', label: 'Spot-less', tier: 'premium', examples: 'Spot-less NXT' },
      { id: 'matex', label: 'Matex', tier: 'mid', examples: 'Matex Gold, Matex EZ Wash' },
      { id: 'vinilex', label: 'Vinilex', tier: 'mid', examples: 'Vinilex' },
      { id: 'breeze', label: 'Breeze', tier: 'economy', examples: 'Breeze' },
      { id: 'easy-coat', label: 'Easy Coat', tier: 'economy', examples: 'Easy Coat 2.0' },
    ],
  },
  {
    // Undecided: choose by budget instead of a brand's range names.
    id: 'suggest',
    label: 'Not sure, suggest the best',
    ranges: [
      { id: 'luxury', label: 'Luxury finish', tier: 'luxury', examples: 'Richest colour and sheen, longest life (e.g. Royale, Silk, Impressions, Velvet Touch)' },
      { id: 'premium', label: 'Premium washable', tier: 'premium', examples: 'Wipe off stains and crayon marks, family favourite (e.g. Apcolite, Easy Clean, Beauty Gold)' },
      { id: 'mid', label: 'Mid-range', tier: 'mid', examples: 'Good finish at a fair price (e.g. Rangoli, Beauty, Matex)' },
      { id: 'economy', label: 'Budget-friendly', tier: 'economy', examples: 'Fresh, clean look for less (e.g. Tractor, Bison, Promise)' },
    ],
  },
];

export const PAINT_EXTRAS = [
  { id: 'damp', label: 'Damp & seepage treatment', hint: 'Damp patches, peeling or salt marks' },
  { id: 'putty', label: 'Wall putty & crack repair', hint: 'Smooth walls before painting' },
  { id: 'texture', label: 'Texture / accent wall', hint: 'A statement wall in living or pooja room' },
  { id: 'wood', label: 'Doors, grills & wood polish', hint: 'Enamel or polish for doors & grills' },
  { id: 'terrace', label: 'Terrace waterproofing', hint: 'Stop leaks before the monsoon' },
];
export const PAINT_TIMING = [
  { id: 'diwali', label: 'Before the festival', hint: 'Limited festive slots' },
  { id: 'month', label: 'Within a month', hint: 'Flexible dates' },
  { id: 'exploring', label: 'Just checking prices', hint: 'Planning ahead' },
];
