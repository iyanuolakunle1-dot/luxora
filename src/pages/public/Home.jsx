import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Sparkles, ShieldCheck, Tag, ArrowRight, PlayCircle } from 'lucide-react';
import { PLACEHOLDER } from '../../utils/placeholderImages';
import { getRoomImageUrl, getOfferImageUrl } from '../../utils/imageHelper';
import api from '../../lib/api';
import Skeleton from '../../components/ui/Skeleton';

const highlights = [
  { icon: Star, title: '5 Star', subtitle: 'Luxury' },
  { icon: Sparkles, title: 'World Class', subtitle: 'Facilities' },
  { icon: Tag, title: 'Best Rate', subtitle: 'Guarantee' },
  { icon: ShieldCheck, title: 'Exclusive', subtitle: 'Offers' },
];

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/room-types', { params: { limit: 3 } }),
      api.get('/offers', { params: { limit: 3, status: 'active' } }),
    ]).then(([r, o]) => {
      setRooms(r.data?.data || []);
      setOffers(o.data?.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[92vh] min-h-[640px] flex items-center overflow-hidden">
        <img src={PLACEHOLDER.heroHome} alt="Luxora Hotels" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-luxora-bg via-luxora-bg/70 to-luxora-bg/20" />
        <div className="relative max-w-7xl mx-auto px-5 w-full">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl">
            <p className="text-luxora-gold text-sm font-semibold tracking-[0.2em] mb-4">WELCOME TO LUXORA</p>
            <h1 className="font-display text-4xl sm:text-6xl leading-[1.1] text-white mb-6">
              Experience Luxury <br /><span className="text-luxora-gold">Like Never Before</span>
            </h1>
            <p className="text-luxora-muted text-base sm:text-lg mb-8 max-w-lg">
              Discover a world of comfort, elegance, and exceptional hospitality. Your perfect stay starts here.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/rooms" className="btn-primary rounded-full px-7">Book Your Stay <ArrowRight size={16} /></Link>
              <Link to="/rooms" className="btn-outline rounded-full px-7 !border-white/30 !text-white hover:!border-luxora-gold hover:!text-luxora-gold">
                <PlayCircle size={17} /> Explore Rooms
              </Link>
            </div>
            <div className="flex flex-wrap gap-6">
              {highlights.map((h) => (
                <div key={h.title} className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full border border-luxora-gold/40 flex items-center justify-center text-luxora-gold"><h.icon size={16} /></div>
                  <div className="leading-tight">
                    <p className="text-white text-sm font-semibold">{h.title}</p>
                    <p className="text-luxora-muted text-xs">{h.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ROOMS PREVIEW */}
      {(loading || rooms.length > 0) && (
        <section className="max-w-7xl mx-auto px-5 py-24">
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="text-luxora-gold text-xs font-semibold tracking-[0.2em] mb-3">OUR ROOMS &amp; SUITES</p>
            <h2 className="font-display text-3xl sm:text-4xl text-white mb-3">Comfort Meets Luxury</h2>
            <p className="text-luxora-muted text-sm">Elegantly designed rooms and suites, crafted for your ultimate comfort.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {loading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-72 w-full rounded-2xl" />) : rooms.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.4 }}
                className="card overflow-hidden group">
                <div className="h-56 overflow-hidden bg-white/5">
                  <img src={getRoomImageUrl(r.images, r.name, i)} alt={r.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-luxora-text mb-1">{r.name}</h3>
                  <p className="text-luxora-muted text-xs mb-3">From <span className="text-luxora-gold font-semibold">₦{Number(r.base_rate).toLocaleString()}</span> / night</p>
                  <Link to="/rooms" className="text-sm text-luxora-gold font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">View Details <ArrowRight size={14} /></Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* OFFERS PREVIEW */}
      {(loading || offers.length > 0) && (
        <section className="bg-luxora-surface py-24">
          <div className="max-w-7xl mx-auto px-5">
            <div className="flex items-end justify-between mb-14 flex-wrap gap-4">
              <div>
                <p className="text-luxora-gold text-xs font-semibold tracking-[0.2em] mb-3">SPECIAL OFFERS</p>
                <h2 className="font-display text-3xl sm:text-4xl text-white">Exclusive Deals For You</h2>
              </div>
              <Link to="/offers" className="btn-outline rounded-full">View All Offers <ArrowRight size={15} /></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {loading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-2xl" />) : offers.map((o, i) => (
                <div key={o.id} className="relative rounded-2xl overflow-hidden h-80 group bg-white/5">
                  <img src={getOfferImageUrl(o.image_url, o.title, i)} alt={o.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  {o.category && <span className="absolute top-4 left-4 badge bg-luxora-gold text-luxora-bg">{o.category}</span>}
                  <div className="absolute bottom-5 left-5 right-5">
                    <h3 className="text-white font-semibold text-lg mb-1">{o.title}</h3>
                    <p className="text-luxora-gold text-sm font-medium">{o.discount_percent ? `Up to ${o.discount_percent}% Off` : 'Special Promo'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative py-28">
        <img src={PLACEHOLDER.lobby} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-luxora-bg/85" />
        <div className="relative max-w-3xl mx-auto text-center px-5">
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-4">Ready For An Unforgettable Stay?</h2>
          <p className="text-luxora-muted mb-8">Book directly with us for the best rates and exclusive member benefits.</p>
          <Link to="/contact" className="btn-primary rounded-full px-8">Book Your Stay Now</Link>
        </div>
      </section>
    </div>
  );
}
