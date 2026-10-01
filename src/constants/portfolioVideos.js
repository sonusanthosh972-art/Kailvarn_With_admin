// Mapping for high-efficiency, compressed interior walkthrough videos.
// Videos are stored in /public/videos/ and encoded with H.264 CRF 24 + faststart
// for instant progressive buffering without downloading all videos upfront.

export const CATEGORY_VIDEOS = {
  'Full Home': '/videos/full-home.mp4',
  'Living Room': '/videos/living-room.mp4',
  'Master Bedroom': '/videos/master-bedroom.mp4',
  'Bedroom': '/videos/master-bedroom.mp4',
  'Kids Bedroom': '/videos/master-bedroom.mp4',
  'Standard Bedroom': '/videos/master-bedroom.mp4',
  'Kitchen': '/videos/modular-kitchen.mp4',
  'L-Shaped Kitchen': '/videos/modular-kitchen.mp4',
  'U-Shaped Kitchen': '/videos/modular-kitchen.mp4',
  'Parallel Kitchen': '/videos/modular-kitchen.mp4',
  'Island Kitchen': '/videos/modular-kitchen.mp4',
  'Straight Kitchen': '/videos/modular-kitchen.mp4',
  'Furniture': '/videos/furniture.mp4',
  'Wardrobe': '/videos/furniture.mp4',
  'TV Unit': '/videos/furniture.mp4',
  'Bed & Headboard': '/videos/furniture.mp4',
  'Dining': '/videos/furniture.mp4',
  'Study & Work': '/videos/furniture.mp4',
  'Shoe Rack & Foyer': '/videos/furniture.mp4',
  'Painting': '/videos/living-room.mp4',
  'Texture Wall': '/videos/living-room.mp4',
  'Stencil & Accent': '/videos/living-room.mp4',
  'Waterproofing': '/videos/living-room.mp4',
  'Commercial': '/videos/commercial.mp4',
  'Offices': '/videos/commercial.mp4',
  'Retail': '/videos/commercial.mp4',
  'Cafés': '/videos/commercial.mp4',
  'Showrooms': '/videos/commercial.mp4',
  'Reception': '/videos/commercial.mp4',
};

export function getVideoForDesign(item) {
  if (!item) return null;
  return item.videoUrl || null;
}

export function hasVideoForDesign(item) {
  return Boolean(item?.videoUrl);
}

