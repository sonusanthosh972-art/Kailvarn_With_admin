// Generating 200 items programmatically based on prompt specifications to ensure accuracy and conciseness

const imgPools = {
  living: [
    "https://images.unsplash.com/photo-1698675951502-5fc1b750c6b1",
    "https://images.unsplash.com/photo-1680007889201-114ac772447d",
    "https://images.unsplash.com/photo-1668586704152-36f3504f9823",
    "https://images.unsplash.com/photo-1524245970184-37743804ce0c",
    "https://images.unsplash.com/photo-1558442086-8ea19a79cd4d"
  ],
  master: [
    // "https://images.unsplash.com/photo-1632210702485-e1841e30752a",
    // "https://images.unsplash.com/photo-1559599238-308793637427",
    // "https://images.unsplash.com/photo-1618220924273-338d82d6b886",
    // "https://images.unsplash.com/photo-1679939153964-2b9bd027f6e3",
    // "https://images.unsplash.com/photo-1591079381491-cb2c19ce7f15"
  ],
  kitchen: [
    // "https://images.unsplash.com/photo-1629079447841-d04df9ee2d72",
    // "https://images.unsplash.com/photo-1552155235-ff96c5ab1328",
    // "https://images.unsplash.com/photo-1699134831822-173d92d74ef2",
    // "https://images.unsplash.com/photo-1600585152220-90363fe7e115",
    // "https://images.unsplash.com/photo-1594297270189-4056091ab583"
  ],
  wardrobe: [
    // "https://images.unsplash.com/photo-1672137233327-37b0c1049e77",
    // "https://images.unsplash.com/photo-1659720879327-827462ca3942",
    // "https://images.unsplash.com/photo-1671508191669-3d93d697e18f",
    // "https://images.unsplash.com/photo-1558997519-83ea9252edf8",
    // "https://images.unsplash.com/photo-1613193196083-f25f4acabf5a"
  ],
  feature: [
    // "https://images.unsplash.com/photo-1700768352543-d7f4d2532201",
    // "https://images.unsplash.com/photo-1618935302552-4343637b1037",
    // "https://images.unsplash.com/photo-1619448439301-b5bd763e4fed",
    // "https://images.unsplash.com/photo-1520163085540-772f6622e1ee",
    // "https://images.unsplash.com/photo-1568598851640-422f4137426c"
  ],
  commercial: [
    // "https://images.unsplash.com/photo-1703430556574-11994feb36a7",
    // "https://images.unsplash.com/photo-1644644949416-52bde1bf0f4e",
    // "https://images.unsplash.com/photo-1596040014705-ceba4af8b524",
    // "https://images.unsplash.com/photo-1606124124032-20e274aad920",
    // "https://images.unsplash.com/photo-1599579138621-934d609f41a4"
  ],
  bathroom: [
    // "https://images.unsplash.com/photo-1644421439741-712c7fde7e95",
    // "https://images.unsplash.com/photo-1655216122621-871f953cf09f",
    // "https://images.unsplash.com/photo-1643949700446-7905f6e08b33",
    // "https://images.unsplash.com/photo-1603825394451-bea89af17bca",
    // "https://images.unsplash.com/photo-1603825394631-f66fb413e970"
  ],
  kids: [
    // "https://images.unsplash.com/photo-1699799462235-53a0ca5a7a43",
    // "https://images.unsplash.com/photo-1696540609399-d3f2fb8d76b8",
    // "https://images.unsplash.com/photo-1442168135051-af7aeff1c877",
    // "https://images.unsplash.com/photo-1693034433366-57fbb0286641",
    // "https://images.unsplash.com/photo-1686040087857-9e3ab3947f41"
  ]
};

const getImageUrl = (poolName, index) => {
  const pool = imgPools[poolName] || imgPools.feature;
  return pool[index % pool.length];
};

const FEATURED_VIDEOS = {
  'full-home-living-room-1': '/videos/living-room.mp4',
  'full-home-master-bedroom-1': '/videos/master-bedroom.mp4',
  'kitchen-l-shaped-kitchen-1': '/videos/modular-kitchen.mp4',
  'furniture-beds-1': '/videos/furniture.mp4',
  'commercial-caf-s-1': '/videos/commercial.mp4',
};

const generateItems = (category, specs) => {
  let items = [];
  
  specs.forEach(spec => {
    for (let i = 0; i < spec.count; i++) {
      const id = `${category.toLowerCase().replace(' ', '-')}-${spec.sub.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${i+1}`;
      items.push({
        id,
        title: `Modern ${spec.sub} Design ${i+1}`,
        category: category,
        subcategory: spec.sub,
        description: `Elegant and functional ${spec.sub.toLowerCase()} design tailored for modern living spaces.`,
        imageUrl: getImageUrl(spec.pool, i),
        videoUrl: FEATURED_VIDEOS[id] || null,
      });
    }
  });
  return items;
};

// Full Home: 60
const fullHomeSpecs = [
  { sub: 'Living Room', count: 15, pool: 'living' },
  { sub: 'Master Bedroom', count: 12, pool: 'master' },
  { sub: 'Kids Bedroom', count: 8, pool: 'kids' },
  { sub: 'Standard Bedroom', count: 10, pool: 'master' }, // reusing master pool
  { sub: 'Bathroom', count: 8, pool: 'bathroom' },
  { sub: 'Toilet', count: 4, pool: 'bathroom' },
  { sub: 'Full Home Overview', count: 3, pool: 'living' }
];

// Kitchen: 35
const kitchenSpecs = [
  { sub: 'L-Shaped Kitchen', count: 8, pool: 'kitchen' },
  { sub: 'U-Shaped Kitchen', count: 7, pool: 'kitchen' },
  { sub: 'Straight Kitchen', count: 6, pool: 'kitchen' },
  { sub: 'Island Kitchen', count: 5, pool: 'kitchen' },
  { sub: 'Parallel Kitchen', count: 5, pool: 'kitchen' },
  { sub: 'Open Kitchen+Dining', count: 4, pool: 'kitchen' }
];

// Furniture: 40
const furnitureSpecs = [
  { sub: 'Beds', count: 8, pool: 'master' },
  { sub: 'Sliding Wardrobes', count: 7, pool: 'wardrobe' },
  { sub: 'Hinged Wardrobes', count: 5, pool: 'wardrobe' },
  { sub: 'TV Units', count: 6, pool: 'feature' },
  { sub: 'Feature Walls', count: 5, pool: 'feature' },
  { sub: 'Partitions', count: 5, pool: 'feature' },
  { sub: 'Study Tables', count: 4, pool: 'feature' }
];

// Painting: 35
const paintingSpecs = [
  { sub: 'Italian Texture', count: 7, pool: 'feature' },
  { sub: 'Sand Texture', count: 6, pool: 'feature' },
  { sub: 'Stucco Finish', count: 5, pool: 'feature' },
  { sub: 'Feature Walls', count: 8, pool: 'feature' },
  { sub: 'Full Room Painted', count: 5, pool: 'living' },
  { sub: 'Exterior Painting', count: 4, pool: 'commercial' }
];

// Commercial: 30
const commercialSpecs = [
  { sub: 'Cafés', count: 8, pool: 'commercial' },
  { sub: 'Offices', count: 7, pool: 'commercial' },
  { sub: 'Retail', count: 6, pool: 'commercial' },
  { sub: 'Showrooms', count: 5, pool: 'commercial' },
  { sub: 'Reception', count: 4, pool: 'commercial' }
];

export const portfolioData = [
  ...generateItems('Full Home', fullHomeSpecs),
  ...generateItems('Kitchen', kitchenSpecs),
  ...generateItems('Furniture', furnitureSpecs),
  ...generateItems('Painting', paintingSpecs),
  ...generateItems('Commercial', commercialSpecs)
];