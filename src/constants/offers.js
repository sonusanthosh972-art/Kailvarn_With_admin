// Seasonal offer shown as the homepage hero and on /painting-quote.
// Set `active: false` after the festival: the homepage falls back to its
// regular hero and the quote page drops the offer wording.
export const DIWALI_OFFER = {
  active: true,
  discount: 25,
  // Saved on the lead so the team can see which offer the customer claimed.
  leadService: 'Painting (Diwali 25% Off)',
  quotePath: '/painting-quote',
  visualizerPath: '/paint-visualizer',
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
export const PAINT_FINISHES = [
  { id: 'budget', label: 'Budget-friendly', tagline: 'A fresh, clean look at a smart price.', features: ['Smooth matt finish', 'Good for rentals & quick refresh'] },
  { id: 'premium', label: 'Premium washable', tagline: 'The family favourite for everyday living.', features: ['Wipe off stains & crayon marks', 'Richer colour that lasts longer'], popular: true },
  { id: 'luxury', label: 'Luxury sheen', tagline: 'Soft glow and a high-end feel.', features: ['Silky sheen finish', 'Best durability & colour depth'] },
  { id: 'help', label: 'Help me choose', tagline: 'Our expert will suggest the right finish at the site visit.', features: [] },
];
export const PAINT_BRANDS = ['Asian Paints', 'Berger', 'Nerolac', 'Dulux', 'JSW Paints', 'Any / suggest best'];
export const PAINT_EXTRAS = [
  { id: 'damp', label: 'Damp & seepage treatment', hint: 'Damp patches, peeling or salt marks' },
  { id: 'putty', label: 'Wall putty & crack repair', hint: 'Smooth walls before painting' },
  { id: 'texture', label: 'Texture / accent wall', hint: 'A statement wall in living or pooja room' },
  { id: 'wood', label: 'Doors, grills & wood polish', hint: 'Enamel or polish for doors & grills' },
  { id: 'terrace', label: 'Terrace waterproofing', hint: 'Stop leaks before the monsoon' },
];
export const PAINT_TIMING = [
  { id: 'diwali', label: 'Before Diwali', hint: 'Limited festive slots' },
  { id: 'month', label: 'Within a month', hint: 'Flexible dates' },
  { id: 'exploring', label: 'Just checking prices', hint: 'Planning ahead' },
];
