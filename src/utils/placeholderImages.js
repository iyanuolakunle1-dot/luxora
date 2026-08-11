/**
 * Centralized placeholder imagery.
 * These use https://picsum.photos (free, reliable, no-auth stock service) with a
 * fixed seed per key so the same "photo" renders consistently across the app.
 *
 * === REPLACE THESE WITH YOUR OWN CLOUDINARY-HOSTED PROPERTY PHOTOGRAPHY ===
 * Simplest path: upload real photos in the admin (Gallery / Rooms / Facilities
 * pages already wired to Cloudinary via `uploadToCloudinary()`), then swap the
 * URLs below (or better — read them straight from Supabase `gallery_images`,
 * `room_types.images`, `facilities.image_url`, etc. as the pages already do
 * once your database has real rows).
 */
const img = (seed, w = 1600, h = 900) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const PLACEHOLDER = {
  heroHome: img('luxora-hero-1'),
  heroRooms: img('luxora-rooms-hero'),
  heroFacilities: img('luxora-facilities-hero'),
  heroDining: img('luxora-dining-hero'),
  heroOffers: img('luxora-offers-hero'),
  heroGallery: img('luxora-gallery-hero'),
  heroAbout: img('luxora-about-hero'),
  heroContact: img('luxora-contact-hero'),

  lobby: img('luxora-lobby'),
  concierge: img('luxora-concierge'),
  spaTreatment: img('luxora-spa'),

  roomDeluxe: img('luxora-room-deluxe'),
  roomExecutive: img('luxora-room-executive'),
  roomSuite: img('luxora-room-suite'),
  roomPresidential: img('luxora-room-presidential'),

  pool: img('luxora-pool'),
  gym: img('luxora-gym'),
  spa: img('luxora-spa-2'),
  meetingRoom: img('luxora-meeting'),
  restaurant: img('luxora-restaurant'),
  kidsArea: img('luxora-kids'),
  parking: img('luxora-parking'),

  fineDining: img('luxora-fine-dining'),
  oceanGrill: img('luxora-ocean-grill'),
  goldenLeaf: img('luxora-golden-leaf'),
  skylineLounge: img('luxora-skyline-lounge'),
  luxeCafe: img('luxora-luxe-cafe'),

  offerSummer: img('luxora-offer-summer'),
  offerRomantic: img('luxora-offer-romantic'),
  offerFamily: img('luxora-offer-family'),
  offerBusiness: img('luxora-offer-business'),
  offerLongstay: img('luxora-offer-longstay'),

  galleryGrid: Array.from({ length: 12 }, (_, i) => img(`luxora-gallery-${i}`, 800, 600)),

  avatar: (seed) => `https://i.pravatar.cc/150?u=${seed}`,
};
