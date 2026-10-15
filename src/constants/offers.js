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

// Popular wall shades shown on the range step, by tier, so families can picture
// the finish on their own walls. Indicative colours only; the exact shade code
// is picked from the brand's shade card at the site visit. A range can override
// these with its own `shades`.
export const PAINT_TIER_SHADES = {
  luxury: [
    { name: 'Royal Emerald', code: 'LX-01', hex: '#1F5C4A' },
    { name: 'Midnight Navy', code: 'LX-02', hex: '#1E2A44' },
    { name: 'Terracotta', code: 'LX-03', hex: '#B5603F' },
    { name: 'Champagne Gold', code: 'LX-04', hex: '#D8C29A' },
    { name: 'Dusty Rose', code: 'LX-05', hex: '#C99A92' },
  ],
  premium: [
    { name: 'Sage Green', code: 'PR-01', hex: '#A8B89A' },
    { name: 'Powder Blue', code: 'PR-02', hex: '#B9CCD8' },
    { name: 'Warm Beige', code: 'PR-03', hex: '#E3D3BC' },
    { name: 'Soft Peach', code: 'PR-04', hex: '#F1C9AE' },
    { name: 'Lavender Mist', code: 'PR-05', hex: '#C9C0D9' },
  ],
  mid: [
    { name: 'Light Sand', code: 'MD-01', hex: '#E9DCC4' },
    { name: 'Mint Fresh', code: 'MD-02', hex: '#CFE3D3' },
    { name: 'Lemon Cream', code: 'MD-03', hex: '#F3E6B0' },
    { name: 'Pearl Grey', code: 'MD-04', hex: '#D6D4CE' },
    { name: 'Blush Pink', code: 'MD-05', hex: '#EFD3CF' },
  ],
  economy: [
    { name: 'Classic Off-White', code: 'EC-01', hex: '#F3EFE6' },
    { name: 'Ivory', code: 'EC-02', hex: '#F2EAD3' },
    { name: 'Sky Blue', code: 'EC-03', hex: '#CFE0EA' },
    { name: 'Light Lemon', code: 'EC-04', hex: '#F4EBC2' },
    { name: 'Pista Green', code: 'EC-05', hex: '#D7E4C4' },
  ],
  decorative: [
    { name: 'Metallic Gold', code: 'DC-01', hex: '#B8964F' },
    { name: 'Stone Grey', code: 'DC-02', hex: '#8E8A82' },
    { name: 'Copper Glow', code: 'DC-03', hex: '#A8623E' },
    { name: 'Concrete', code: 'DC-04', hex: '#A6A39C' },
    { name: 'Deep Teal', code: 'DC-05', hex: '#24575A' },
  ],
  specialty: [
    { name: 'Calm White', code: 'SP-01', hex: '#F1F0EB' },
    { name: 'Eucalyptus', code: 'SP-02', hex: '#B7C7B4' },
    { name: 'Morning Blue', code: 'SP-03', hex: '#C8D6DE' },
    { name: 'Oat', code: 'SP-04', hex: '#E2D6C2' },
    { name: 'Soft Clay', code: 'SP-05', hex: '#D9B9A3' },
  ],
};

// Last option on every brand's range step.
export const PAINT_RANGE_HELP = { id: 'help', label: 'Help me choose', tier: '', examples: 'Our expert suggests the right range for your walls and budget at the site visit.' };

export const PAINT_BRANDS = [
  {
    id: 'asian-paints',
    label: 'Asian Paints',
    ranges: [
      {
        id: 'royale',
        label: 'Royale',
        tier: 'luxury',
        examples: 'Royale Luxury Emulsion, Royale Shyne, Royale Matt, Royale Aspira, Royale Glitz',
        shades: [
          { name: 'Brilliant White', code: 'L101', hex: '#FFFFFF' },
          { name: 'Deep Sea Blue', code: '9159', hex: '#1F314F' },
          { name: 'Classic Ivory', code: '0315', hex: '#F4F0EC' },
          { name: 'Sea Nymph', code: '7562', hex: '#B3DACB' },
          { name: 'Twilight Zone', code: '7325', hex: '#335492' },
        ],
      },
      {
        id: 'apcolite',
        label: 'Apcolite',
        tier: 'premium',
        examples: 'Apcolite Premium Emulsion, Apcolite Advanced Shyne, Apcolite Satin',
        shades: [
          { name: 'Morning Glory', code: '0414', hex: '#F7F5EE' },
          { name: 'Blue Fragrance', code: '9191', hex: '#6498D2' },
          { name: 'Earthy Green', code: '9319', hex: '#7DA27E' },
          { name: 'Blushing Rose', code: '5117', hex: '#E3B8A6' },
          { name: 'Soft Chiffon', code: '7931', hex: '#EBDCC6' },
        ],
      },
      {
        id: 'tractor',
        label: 'Tractor',
        tier: 'economy',
        examples: 'Tractor Sparc, Tractor Shyne',
        shades: [
          { name: 'Classic Off-White', code: '0212', hex: '#F3EFE6' },
          { name: 'Butter Cream', code: 'L504', hex: '#FFFDD0' },
          { name: 'Sky Blue', code: '0178', hex: '#CFE0EA' },
          { name: 'Pista Green', code: '7721', hex: '#D7E4C4' },
          { name: 'Light Peach', code: '5092', hex: '#F8DFC8' },
        ],
      },
      {
        id: 'textures',
        label: 'Textures & special finishes',
        tier: 'decorative',
        examples: 'Royale Lustre, Royale Play Safari, Stucco & Metallic finishes',
        shades: [
          { name: 'Safari Gold', code: 'M002', hex: '#C59A45' },
          { name: 'Raw Silk Crimson', code: 'M014', hex: '#8E2838' },
          { name: 'Stucco Stone Grey', code: 'M708', hex: '#8E8A82' },
          { name: 'Dune Copper', code: 'M021', hex: '#A8623E' },
          { name: 'Teal Oasis Metallic', code: 'M045', hex: '#1B5E63' },
        ],
      },
    ],
  },
  {
    id: 'berger',
    label: 'Berger',
    ranges: [
      {
        id: 'silk',
        label: 'Silk',
        tier: 'luxury',
        examples: 'Silk Glamor Dazzle, Silk Glamor High Sheen, Silk Glamor Soft Sheen, Silk Glamor Matt',
        shades: [
          { name: 'Amorous', code: '1P 8568', hex: '#8C4A58' },
          { name: 'Meandering Garden', code: '4T 0941', hex: '#4A5D4E' },
          { name: 'Baby Blush', code: '1D 8566', hex: '#EFC1B8' },
          { name: 'Cool Shadow', code: '8D 1815', hex: '#D0D3D4' },
          { name: 'Royal Crest', code: '3D 0256', hex: '#D4AF37' },
        ],
      },
      {
        id: 'easy-clean',
        label: 'Easy Clean',
        tier: 'premium',
        examples: 'Easy Clean, Easy Clean Fresh, Easy Clean Silky Touch',
        shades: [
          { name: 'Pure White', code: '8P 0201', hex: '#F4F5F7' },
          { name: 'Vanilla Latte', code: '2T 0602', hex: '#D5BCA6' },
          { name: 'Barbie Pink', code: '1D 0512', hex: '#F39AC9' },
          { name: 'Frosty Mint', code: '4P 0113', hex: '#D2EBD4' },
          { name: 'Silver Shadows', code: '8T 1714', hex: '#B8BEC1' },
        ],
      },
      {
        id: 'rangoli',
        label: 'Rangoli',
        tier: 'mid',
        examples: 'Rangoli Rich Matt, Rangoli Total Care',
        shades: [
          { name: 'Rangoli Cream', code: '3P 0072', hex: '#F8F1DD' },
          { name: 'Sky Wonder', code: '5T 1102', hex: '#BCE0F5' },
          { name: 'Almond Cream', code: '2P 0583', hex: '#E8D8C3' },
          { name: 'Spring Leaf', code: '4P 0922', hex: '#C8E3C6' },
          { name: 'Tea Rose', code: '1P 0482', hex: '#F4D3CE' },
        ],
      },
      {
        id: 'bison',
        label: 'Bison',
        tier: 'economy',
        examples: 'Bison Emulsion, Bison Glow, Bison Lite',
        shades: [
          { name: 'Bison Off-White', code: '8P 0001', hex: '#F6F4EB' },
          { name: 'Pale Ivory', code: '2P 0012', hex: '#F2E9D0' },
          { name: 'Ocean Breeze', code: '5P 0134', hex: '#D0E5EE' },
          { name: 'Sunny Glow', code: '3T 0783', hex: '#F9ECC4' },
          { name: 'Soft Willow', code: '4P 0081', hex: '#DCE6D2' },
        ],
      },
      {
        id: 'glamart',
        label: 'Silk GlamArt',
        tier: 'decorative',
        examples: 'Metallica, Stucco, Vintage, Stone & Tones, Non-Metallic',
        shades: [
          { name: 'Imperial Gold', code: 'GA-M01', hex: '#CCA43B' },
          { name: 'Vintage Bronze', code: 'GA-M08', hex: '#8C5D38' },
          { name: 'Stucco Marble', code: 'GA-S02', hex: '#EBE6DD' },
          { name: 'Metallica Ruby', code: 'GA-M15', hex: '#7D1D2B' },
          { name: 'Metallica Sapphire', code: 'GA-M22', hex: '#1C3B6F' },
        ],
      },
    ],
  },
  {
    id: 'nerolac',
    label: 'Nerolac',
    ranges: [
      {
        id: 'impressions',
        label: 'Impressions',
        tier: 'luxury',
        examples: 'Impressions Kashmir, Impressions Ultra HD, Impressions HD, Impressions Sheen, Impressions Ultra Fresh',
        shades: [
          { name: 'Ra Gold', code: '2042', hex: '#DAA33F' },
          { name: 'Cobalt Night', code: 'NP217', hex: '#0047AB' },
          { name: 'Crystal White', code: 'W-101', hex: '#F9F9F9' },
          { name: 'Olivero Gold', code: '4008', hex: '#CAAB52' },
          { name: 'Blush Rose', code: 'NP116', hex: '#F9C2CF' },
        ],
      },
      {
        id: 'beauty-gold',
        label: 'Beauty Gold',
        tier: 'premium',
        examples: 'Beauty Gold Washable, Beauty Gold Washable NXT, Beauty Gold Washable Plus',
        shades: [
          { name: 'Golden Glaze', code: '2043', hex: '#F5E7CB' },
          { name: 'Pacific Bay', code: '4935', hex: '#2E6B9E' },
          { name: 'Almond Beige', code: 'NP515', hex: '#EFDECD' },
          { name: 'Powder Blue', code: '2366', hex: '#B0E0E6' },
          { name: 'Hayley White', code: 'W-108', hex: '#F5F2EB' },
        ],
      },
      {
        id: 'beauty',
        label: 'Beauty',
        tier: 'mid',
        examples: 'Beauty Gold, Beauty Sheen, Beauty Smooth',
        shades: [
          { name: 'Butter Yellow', code: 'NP404', hex: '#FFFDD0' },
          { name: 'Clear Blue Sky', code: '4901', hex: '#87CEEB' },
          { name: 'Cotton Soft', code: 'NP007', hex: '#FFF5EE' },
          { name: 'Mineral Water', code: '2577', hex: '#E0F8F7' },
          { name: 'Baby Pink', code: 'NP109', hex: '#FFB6C1' },
        ],
      },
      {
        id: 'little-master',
        label: 'Little Master',
        tier: 'economy',
        examples: 'Beauty Little Master, Beauty Little Master Sheen',
        shades: [
          { name: 'Cloud White', code: 'NP615', hex: '#F0F0F0' },
          { name: 'Classic Ivory', code: 'NP501', hex: '#F4EED9' },
          { name: 'Calm Breeze', code: 'NP211', hex: '#D8EBF2' },
          { name: 'Morning Primrose', code: 'NP401', hex: '#F9F4CD' },
          { name: 'Tender Green', code: 'NP305', hex: '#DBEBD4' },
        ],
      },
      {
        id: 'designer',
        label: 'Special / Designer',
        tier: 'decorative',
        examples: 'Impressions Kashmir and other decorative / special-effect finishes',
        shades: [
          { name: 'Pot Of Gold', code: '4036', hex: '#9B7646' },
          { name: 'Royale Gold', code: '4016', hex: '#BC923D' },
          { name: 'Kashmir Velvet Plum', code: 'K-802', hex: '#5A2A42' },
          { name: 'Metallic Silver Mist', code: 'K-102', hex: '#C4C8CC' },
          { name: 'Azure Oasis', code: 'K-512', hex: '#1A4D62' },
        ],
      },
    ],
  },
  {
    id: 'dulux',
    label: 'Dulux',
    ranges: [
      {
        id: 'velvet-touch',
        label: 'Velvet Touch',
        tier: 'luxury',
        examples: 'Velvet Touch Eterna, Diamond Glo, Pearl Glo, Platinum Glo',
        shades: [
          { name: 'Tusk Tusk', code: '30YY 79/070', hex: '#ECE2D2' },
          { name: 'Rich Burgundy', code: '10RR 13/371', hex: '#621D27' },
          { name: 'Deep Sapphire', code: '30BB 10/112', hex: '#182B49' },
          { name: 'Natural Calico', code: '10YY 72/080', hex: '#E5DCC9' },
          { name: 'Emerald Jewel', code: '90GG 19/151', hex: '#245848' },
        ],
      },
      {
        id: 'superclean',
        label: 'SuperClean',
        tier: 'premium',
        examples: 'SuperClean, SuperClean 3in1',
        shades: [
          { name: 'White on White', code: '30GY 88/014', hex: '#EDECE7' },
          { name: 'French Cream', code: '25YY 83/103', hex: '#F4F0E1' },
          { name: 'Sky Blue Whispers', code: '50BG 76/090', hex: '#D2E4EC' },
          { name: 'Soft Peach Bloom', code: '60YR 75/147', hex: '#FBE0D0' },
          { name: 'Tranquil Dawn', code: '45GY 55/180', hex: '#CFDAD0' },
        ],
      },
      {
        id: 'supercover',
        label: 'SuperCover',
        tier: 'mid',
        examples: 'SuperCover Ultra',
        shades: [
          { name: 'Warm Barley', code: '20YY 68/102', hex: '#E8DFCB' },
          { name: 'Morning Frost', code: '50GY 83/040', hex: '#E4EAE1' },
          { name: 'Pale Dove Grey', code: '50BG 64/028', hex: '#CCD3D6' },
          { name: 'Sunburst Yellow', code: '40YY 73/344', hex: '#F6E294' },
          { name: 'Meadow Grass', code: '10GY 58/278', hex: '#ADC49F' },
        ],
      },
      {
        id: 'promise',
        label: 'Promise',
        tier: 'economy',
        examples: 'Promise Interior, Promise Sheen Interior, Promise SmartChoice',
        shades: [
          { name: 'Brilliant Off-White', code: '00NN 83/000', hex: '#F3F1EC' },
          { name: 'Sunlight Ivory', code: '35YY 81/174', hex: '#F4EBCF' },
          { name: 'Coastal Breeze', code: '70BG 68/056', hex: '#D4E1E5' },
          { name: 'Rose Quartz', code: '50RR 74/090', hex: '#F5DBDE' },
          { name: 'Pista Tint', code: '50YY 77/285', hex: '#DFE8BE' },
        ],
      },
      {
        id: 'better-living',
        label: 'Better Living',
        tier: 'specialty',
        examples: 'Better Living Air Clean Biobased',
        shades: [
          { name: 'Air Clean Linen', code: '90YY 83/071', hex: '#F0EDE1' },
          { name: 'Eucalyptus Breathe', code: '70GY 68/086', hex: '#D0DCD0' },
          { name: 'Cloudless Blue', code: '30BG 72/069', hex: '#D0DEE5' },
          { name: 'Warm Cashmere', code: '30YY 69/048', hex: '#D8D2C3' },
          { name: 'Terracotta Clay', code: '80YR 49/382', hex: '#CB7C62' },
        ],
      },
      {
        id: 'simply-refresh',
        label: 'Simply Refresh',
        tier: 'specialty',
        examples: 'Simply Refresh',
        shades: [
          { name: 'Fresh Alpine White', code: '40YY 83/043', hex: '#FAF7EF' },
          { name: 'Crisp Nordic Grey', code: '00NN 53/000', hex: '#B8BAC0' },
          { name: 'Calming Sage', code: '90GY 63/186', hex: '#BED1B7' },
          { name: 'Warm Honey Cream', code: '20YY 65/248', hex: '#EED5A5' },
          { name: 'Ocean Wave', code: '10BB 40/256', hex: '#4C7B99' },
        ],
      },
    ],
  },
  {
    id: 'nippon',
    label: 'Nippon',
    ranges: [
      {
        id: 'aircare',
        label: 'AirCare VG',
        tier: 'luxury',
        examples: 'AirCare VG anti-formaldehyde luxury finish',
        shades: [
          { name: 'Odour-less Pure White', code: 'OW 01', hex: '#FBFBF9' },
          { name: 'Sanded Birch', code: 'NP N 1818 P', hex: '#D4CBB0' },
          { name: 'Zen Green', code: 'NP BGG 1605 T', hex: '#A8BAA5' },
          { name: 'Serene Sky', code: 'NP PB 1478 T', hex: '#B8CBD8' },
          { name: 'Gentle Fawn', code: 'NP N 1845 P', hex: '#DED2BE' },
        ],
      },
      {
        id: 'satin-glo',
        label: 'Satin Glo',
        tier: 'luxury',
        examples: 'Satin Glo Prime, Satin Glo+, Satin Glo Aura',
        shades: [
          { name: 'Pebble Walk', code: 'NP N 1817 P', hex: '#D2C8AD' },
          { name: 'Old Box Charcoal', code: 'NP N 1820 A', hex: '#B8AD99' },
          { name: 'Favorite Shawl', code: 'NP N 1903 T', hex: '#C9B29B' },
          { name: 'Smoking Gray', code: 'NP N 2045 T', hex: '#A3A7A8' },
          { name: 'Satin Royal Blue', code: 'NP PB 1530 D', hex: '#234374' },
        ],
      },
      {
        id: 'spotless',
        label: 'Spot-less',
        tier: 'premium',
        examples: 'Spot-less NXT anti-stain washability',
        shades: [
          { name: 'Spotless Pure White', code: 'NP OW 1081 P', hex: '#F7F7F5' },
          { name: 'Absolute Yellow', code: 'NP YO 1113 P', hex: '#F4E298' },
          { name: 'Rose Fragrance', code: 'NP R 1272 P', hex: '#F5D3D6' },
          { name: 'Mint Frost', code: 'NP BGG 1672 P', hex: '#CEE5DB' },
          { name: 'Soft Denim', code: 'NP PB 1494 T', hex: '#7B9FB9' },
        ],
      },
      {
        id: 'matex',
        label: 'Matex',
        tier: 'mid',
        examples: 'Matex Gold, Matex EZ Wash',
        shades: [
          { name: 'Matex White', code: 'NP OW 1001 P', hex: '#F5F5EE' },
          { name: 'Golden Harvest', code: 'NP YO 1152 T', hex: '#EED18D' },
          { name: 'Misty Morning', code: 'NP N 2002 P', hex: '#D6DADB' },
          { name: 'Apple Orchard', code: 'NP BGG 1634 P', hex: '#CCE0C4' },
          { name: 'Desert Sand', code: 'NP N 1863 T', hex: '#DBC4A7' },
        ],
      },
      {
        id: 'vinilex',
        label: 'Vinilex',
        tier: 'mid',
        examples: 'Vinilex Fresh Interior Emulsion',
        shades: [
          { name: 'Fresh Ivory', code: 'NP YO 1102 P', hex: '#F6EED8' },
          { name: 'Sky View', code: 'NP PB 1442 P', hex: '#CBE0ED' },
          { name: 'Pale Almond', code: 'NP N 1826 P', hex: '#E8DEC9' },
          { name: 'Spring Shoot', code: 'NP BGG 1591 P', hex: '#D9E8CE' },
          { name: 'Lilac Mist', code: 'NP PB 1404 P', hex: '#DDD4E3' },
        ],
      },
      {
        id: 'breeze',
        label: 'Breeze',
        tier: 'economy',
        examples: 'Breeze Interior Emulsion',
        shades: [
          { name: 'Breeze Off-White', code: 'NP OW 1005 P', hex: '#F3F1E7' },
          { name: 'Cream Puff', code: 'NP YO 1108 P', hex: '#F4E9CD' },
          { name: 'Pale Blue', code: 'NP PB 1431 P', hex: '#D1DFE8' },
          { name: 'Pista Delight', code: 'NP BGG 1618 P', hex: '#DCE7CD' },
          { name: 'Sunrise Coral', code: 'NP R 1261 P', hex: '#F7DCD2' },
        ],
      },
      {
        id: 'easy-coat',
        label: 'Easy Coat',
        tier: 'economy',
        examples: 'Easy Coat 2.0 Interior Acrylic',
        shades: [
          { name: 'Bright White', code: 'NP OW 1002 P', hex: '#F8F8F5' },
          { name: 'Butter Milk', code: 'NP YO 1118 P', hex: '#F5E8C8' },
          { name: 'Aqua Tint', code: 'NP BGG 1680 P', hex: '#D2E7E2' },
          { name: 'Cool Ash', code: 'NP N 2011 P', hex: '#D2D4D5' },
          { name: 'Coral Blush', code: 'NP R 1253 P', hex: '#F4D5CB' },
        ],
      },
    ],
  },
  {
    id: 'birla-opus',
    label: 'Birla Opus',
    ranges: [
      {
        id: 'one',
        label: 'One',
        tier: 'luxury',
        examples: 'One Pure Elegance, One Pure Elegance Shine, One Pure Elegance Matt, One Pure Legend',
        shades: [
          { name: 'Majestic Gold', code: 'BO 1012', hex: '#C89F43' },
          { name: 'Heritage Royal Navy', code: 'BO 5024', hex: '#1E2D4C' },
          { name: 'Pure Elegance White', code: 'BO 9001', hex: '#FAF8F5' },
          { name: 'Velvet Moss', code: 'BO 4018', hex: '#4D644E' },
          { name: 'Rose Quartz Lux', code: 'BO 2015', hex: '#D8A4A0' },
        ],
      },
      {
        id: 'calista',
        label: 'Calista',
        tier: 'premium',
        examples: 'Calista Ever Wash, Calista Ever Wash Shine, Calista Ever Clear, Calista Ever Clear Matt, Calista Ever Stay',
        shades: [
          { name: 'Calista Ivory Glow', code: 'BO 9015', hex: '#F4EDE0' },
          { name: 'Morning Dew Blue', code: 'BO 5008', hex: '#B8D1E2' },
          { name: 'Warm Sandstone', code: 'BO 8022', hex: '#DFCEB7' },
          { name: 'Pistachio Cream', code: 'BO 4006', hex: '#CFDFCB' },
          { name: 'Sunset Ochre', code: 'BO 1028', hex: '#E2B56A' },
        ],
      },
      {
        id: 'style',
        label: 'Style',
        tier: 'economy',
        examples: 'Style Color Smart, Style Color Smart Shine, Style Color Fresh, Style Super Bright, Style Super Smooth',
        shades: [
          { name: 'Fresh Off-White', code: 'BO 9005', hex: '#F2EFE8' },
          { name: 'Soft Cream', code: 'BO 8003', hex: '#EFE3C6' },
          { name: 'Sky Blue', code: 'BO 5002', hex: '#CDE0EC' },
          { name: 'Pale Mint', code: 'BO 4001', hex: '#D3E5D4' },
          { name: 'Peach Bloom', code: 'BO 2004', hex: '#F6D6C6' },
        ],
      },
    ],
  },
  {
    // Undecided: choose by budget instead of a brand's range names.
    id: 'suggest',
    label: 'Not sure, suggest the best',
    ranges: [
      {
        id: 'luxury',
        label: 'Luxury finish',
        tier: 'luxury',
        examples: 'Richest colour and sheen, longest life (e.g. Royale, Silk, Impressions, Velvet Touch)',
        shades: [
          { name: 'Asian Paints Deep Sea', code: '9159', hex: '#1F314F' },
          { name: 'Berger Silk Amorous', code: '1P 8568', hex: '#8C4A58' },
          { name: 'Dulux Velvet Tusk Tusk', code: '30YY 79/070', hex: '#ECE2D2' },
          { name: 'Nerolac Impressions Gold', code: '2042', hex: '#DAA33F' },
          { name: 'Birla Opus Royal Moss', code: 'BO 4018', hex: '#4D644E' },
        ],
      },
      {
        id: 'premium',
        label: 'Premium washable',
        tier: 'premium',
        examples: 'Wipe off stains and crayon marks, family favourite (e.g. Apcolite, Easy Clean, Beauty Gold)',
        shades: [
          { name: 'Apcolite Blue Fragrance', code: '9191', hex: '#6498D2' },
          { name: 'Berger Vanilla Latte', code: '2T 0602', hex: '#D5BCA6' },
          { name: 'Dulux Tranquil Dawn', code: '45GY 55/180', hex: '#CFDAD0' },
          { name: 'Nerolac Pacific Bay', code: '4935', hex: '#2E6B9E' },
          { name: 'Nippon Absolute Yellow', code: 'NP YO 1113 P', hex: '#F4E298' },
        ],
      },
      {
        id: 'mid',
        label: 'Mid-range',
        tier: 'mid',
        examples: 'Good finish at a fair price (e.g. Rangoli, Beauty, Matex)',
        shades: [
          { name: 'Berger Rangoli Cream', code: '3P 0072', hex: '#F8F1DD' },
          { name: 'Nerolac Clear Blue Sky', code: '4901', hex: '#87CEEB' },
          { name: 'Dulux Meadow Grass', code: '10GY 58/278', hex: '#ADC49F' },
          { name: 'Nippon Golden Harvest', code: 'NP YO 1152 T', hex: '#EED18D' },
          { name: 'Apcolite Soft Chiffon', code: '7931', hex: '#EBDCC6' },
        ],
      },
      {
        id: 'economy',
        label: 'Budget-friendly',
        tier: 'economy',
        examples: 'Fresh, clean look for less (e.g. Tractor, Bison, Promise)',
        shades: [
          { name: 'Tractor Butter Cream', code: 'L504', hex: '#FFFDD0' },
          { name: 'Bison Pale Ivory', code: '2P 0012', hex: '#F2E9D0' },
          { name: 'Dulux Coastal Breeze', code: '70BG 68/056', hex: '#D4E1E5' },
          { name: 'Little Master Calm Breeze', code: 'NP211', hex: '#D8EBF2' },
          { name: 'Birla Opus Pale Mint', code: 'BO 4001', hex: '#D3E5D4' },
        ],
      },
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
