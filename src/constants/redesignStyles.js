// The 5 reference styles a visitor can pick for AI Room Redesign. These
// are the same 5 underlying photos used across all "Modern Living Room
// Design N" portfolio cards (see imgPools.living in portfolioData.js --
// that pool only has 5 images, cycled with `i % 5`, so every "Living
// Room" portfolio entry is really just one of these five looks).
//
// Exported from its own file (not read out of portfolioData.js, whose
// pool is a private module-level const) so both the server route and the
// client component can share one source of truth.
//
// All 5 photos are served from public/redesign-styles/ (downloaded once
// from Unsplash) rather than live-fetched on each request -- Unsplash
// was measured hanging well past a normal request timeout when this
// route first live-fetched them, and separately its CDN was slow enough
// during testing to leave even the client-side thumbnails blank for 8+
// seconds. These photos never change, so there's no reason either the
// server or the client should depend on Unsplash's live availability for
// them. `sourceUrl` is kept only as provenance, not used at runtime.
export const REDESIGN_STYLES = [
  {
    id: '1',
    label: 'Modern Living Room Design 1',
    thumbnailUrl: '/redesign-styles/1.jpg',
    localPath: 'public/redesign-styles/1.jpg',
    sourceUrl: 'https://images.unsplash.com/photo-1698675951502-5fc1b750c6b1',
  },
  {
    id: '2',
    label: 'Modern Living Room Design 2',
    thumbnailUrl: '/redesign-styles/2.jpg',
    localPath: 'public/redesign-styles/2.jpg',
    sourceUrl: 'https://images.unsplash.com/photo-1680007889201-114ac772447d',
  },
  {
    id: '3',
    label: 'Modern Living Room Design 3',
    thumbnailUrl: '/redesign-styles/3.jpg',
    localPath: 'public/redesign-styles/3.jpg',
    sourceUrl: 'https://images.unsplash.com/photo-1668586704152-36f3504f9823',
  },
  {
    id: '4',
    label: 'Modern Living Room Design 4',
    thumbnailUrl: '/redesign-styles/4.jpg',
    localPath: 'public/redesign-styles/4.jpg',
    sourceUrl: 'https://images.unsplash.com/photo-1524245970184-37743804ce0c',
  },
  {
    id: '5',
    label: 'Modern Living Room Design 5',
    thumbnailUrl: '/redesign-styles/5.jpg',
    localPath: 'public/redesign-styles/5.jpg',
    sourceUrl: 'https://images.unsplash.com/photo-1558442086-8ea19a79cd4d',
  },
];
