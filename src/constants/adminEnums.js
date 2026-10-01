// Client-safe copies of the enums in src/server/models.js (keep in sync).
export const DESIGN_CATEGORIES = ['Full Home', 'Living Room', 'Bedroom', 'Kids Bedroom', 'Kitchen', 'Furniture', 'Painting', 'Commercial'];
export const PROJECT_STATUSES = ['draft', 'published'];
export const LEAD_STATUSES = ['NEW', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED'];
export const LEAD_STATUS_LABELS = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
  CLOSED: 'Closed',
};
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_RAW_IMAGE_BYTES = 40 * 1024 * 1024; // before in-browser optimisation
