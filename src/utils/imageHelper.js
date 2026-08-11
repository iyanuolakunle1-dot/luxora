const LUXURY_ROOM_FALLBACKS = [
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
];

const LUXURY_FACILITY_FALLBACKS = {
  pool: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80',
  spa: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
  wellness: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80',
  gym: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
  fitness: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
  dining: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  restaurant: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
  bar: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80',
  lounge: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80',
  default: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
};

const LUXURY_OFFER_FALLBACKS = [
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
];

/**
 * Resolves a room type's image array/string to a valid image URL.
 */
export function getRoomImageUrl(images, name = '', index = 0) {
  if (Array.isArray(images) && images.length > 0) {
    const first = images[0];
    if (typeof first === 'string' && first.trim().length > 5) return first.trim();
  } else if (typeof images === 'string' && images.trim().length > 5) {
    const trimmed = images.trim();
    if (trimmed.startsWith('http') || trimmed.startsWith('data:image')) return trimmed;
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed) && parsed[0]) return parsed[0];
    } catch {
      // not json
    }
  }

  const charCode = name ? name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) : index;
  return LUXURY_ROOM_FALLBACKS[charCode % LUXURY_ROOM_FALLBACKS.length];
}

/**
 * Resolves a facility image URL.
 */
export function getFacilityImageUrl(imageUrl, name = '', category = '') {
  if (typeof imageUrl === 'string' && imageUrl.trim().length > 5) {
    const trimmed = imageUrl.trim();
    if (trimmed.startsWith('http') || trimmed.startsWith('data:image')) return trimmed;
  }

  const key = (category + ' ' + name).toLowerCase();
  for (const [k, url] of Object.entries(LUXURY_FACILITY_FALLBACKS)) {
    if (key.includes(k)) return url;
  }
  return LUXURY_FACILITY_FALLBACKS.default;
}

/**
 * Resolves an offer image URL.
 */
export function getOfferImageUrl(imageUrl, title = '', index = 0) {
  if (typeof imageUrl === 'string' && imageUrl.trim().length > 5) {
    const trimmed = imageUrl.trim();
    if (trimmed.startsWith('http') || trimmed.startsWith('data:image')) return trimmed;
  }
  const charCode = title ? title.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) : index;
  return LUXURY_OFFER_FALLBACKS[charCode % LUXURY_OFFER_FALLBACKS.length];
}

/**
 * Resolves a dining menu item image URL.
 */
export function getDiningImageUrl(imageUrl, name = '') {
  if (typeof imageUrl === 'string' && imageUrl.trim().length > 5) {
    const trimmed = imageUrl.trim();
    if (trimmed.startsWith('http') || trimmed.startsWith('data:image')) return trimmed;
  }
  return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80';
}
