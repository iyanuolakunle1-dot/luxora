import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Tag, CreditCard, ShieldCheck, Headphones } from 'lucide-react';
import { PLACEHOLDER } from '../../utils/placeholderImages';
import { getOfferImageUrl } from '../../utils/imageHelper';
import api from '../../lib/api';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';

const perks = [
  { icon: ShieldCheck, title: 'Exclusive Benefits', desc: 'Enjoy exclusive perks and privileges with every offer.' },
  { icon: CreditCard, title: 'Flexible Booking', desc: 'Change or cancel your booking with flexible options.' },
  { icon: Tag, title: 'Safe & Secure', desc: 'Your safety and comfort are our top priority.' },
  { icon: Headphones, title: '24/7 Support', desc: 'Our support team is always here to assist you.' },
];

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('All Offers');
  const [selectedOffer, setSelectedOffer] = useState(null);

  useEffect(() => {
    api.get('/offers', { params: { limit: 50, status: 'active' } })
      .then(({ data }) => setOffers(data?.data || []))
      .catch(() => setOffers([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All Offers', ...new Set(offers.map((o) => o.category).filter(Boolean))];
  const filtered = active === 'All Offers' ? offers : offers.filter((o) => o.category === active);

  return (
    <div className="pt-20">
      <section className="relative h-[56vh] min-h-[420px] flex items-center">
        <img src={PLACEHOLDER.heroOffers} className="absolute inset-0 w-full h-full object-cover" alt="Offers" />
        <div className="absolute inset-0 bg-gradient-to-r from-luxora-bg via-luxora-bg/60 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-5 w-full">
          <p className="text-luxora-gold text-xs font-semibold tracking-[0.2em] mb-3">SPECIAL OFFERS</p>
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-4 max-w-xl">Exclusive Offers For <span className="text-luxora-gold">Unforgettable Stays</span></h1>
          <p className="text-luxora-muted max-w-md">Take advantage of our handpicked offers and enjoy luxury experiences at unbeatable value.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 py-16">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-96 w-full rounded-2xl" />)}
          </div>
        ) : offers.length ? (
          <>
            <div className="flex gap-3 overflow-x-auto pb-2 mb-10">
              {categories.map((c) => (
                <button key={c} onClick={() => setActive(c)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${active === c ? 'bg-luxora-gold text-luxora-bg border-luxora-gold' : 'border-luxora-border text-luxora-muted hover:border-luxora-gold hover:text-luxora-gold'}`}>{c}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((o, i) => (
                <motion.div key={o.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="card overflow-hidden group">
                  <div className="relative h-56 overflow-hidden bg-white/5">
                    <img src={getOfferImageUrl(o.image_url, o.title, i)} alt={o.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    {o.category && <span className="absolute top-4 left-4 badge bg-luxora-gold text-luxora-bg">{o.category}</span>}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-luxora-text text-lg mb-2">{o.title}</h3>
                    <p className="text-sm text-luxora-muted mb-4">{o.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-luxora-muted">{o.valid_from && o.valid_to ? `Valid till ${o.valid_to}` : ''}</span>
                      <span className="text-luxora-gold text-sm font-semibold">
                        {o.discount_percent ? `Up to ${o.discount_percent}% Off` : o.fixed_price ? `₦${Number(o.fixed_price).toLocaleString()}` : ''}
                      </span>
                    </div>
                    <button className="btn-primary w-full justify-center" onClick={() => setSelectedOffer(o)}>View Details</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <EmptyState icon={Tag} title="No offers published yet"
            message="Offers created from the admin dashboard (Offers & Packages → Create New Offer, status set to Active) will automatically appear here." />
        )}
      </section>

      {/* OFFER DETAILS MODAL */}
      <Modal open={!!selectedOffer} onClose={() => setSelectedOffer(null)} title={selectedOffer?.title || 'Special Offer'} size="md"
        footer={<>
          <button className="btn-outline" onClick={() => setSelectedOffer(null)}>Close</button>
          <Link to="/rooms" className="btn-primary" onClick={() => setSelectedOffer(null)}>Book a Room with this Offer</Link>
        </>}>
        {selectedOffer && (
          <div className="space-y-4">
            <div className="h-44 rounded-xl overflow-hidden bg-white/5 border border-luxora-border">
              <img src={getOfferImageUrl(selectedOffer.image_url, selectedOffer.title)} alt={selectedOffer.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="badge bg-luxora-gold text-luxora-bg text-xs">{selectedOffer.category || 'Special Offer'}</span>
              <h3 className="text-xl font-bold text-luxora-text mt-2">{selectedOffer.title}</h3>
              <p className="text-luxora-gold font-bold text-lg mt-1">
                {selectedOffer.discount_percent ? `${selectedOffer.discount_percent}% Discount` : selectedOffer.fixed_price ? `Fixed Price: ₦${Number(selectedOffer.fixed_price).toLocaleString()}` : 'Special Package'}
              </p>
            </div>
            <p className="text-sm text-luxora-muted leading-relaxed">{selectedOffer.description || 'Enjoy our exclusive package crafted to give you the finest luxury experience.'}</p>
            <div className="p-3 bg-white/5 border border-luxora-border rounded-xl text-xs space-y-1.5 text-luxora-muted">
              {selectedOffer.valid_from && selectedOffer.valid_to && (
                <p>📅 <strong className="text-luxora-text">Validity Period:</strong> {selectedOffer.valid_from} to {selectedOffer.valid_to}</p>
              )}
              <p>🏷️ <strong className="text-luxora-text">Offer Type:</strong> {selectedOffer.type?.replace('_', ' ').toUpperCase()}</p>
              <p>✨ <strong className="text-luxora-text">Terms:</strong> Applicable on all qualifying room categories.</p>
            </div>
          </div>
        )}
      </Modal>

      <section className="border-t border-luxora-border">
        <div className="max-w-7xl mx-auto px-5 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {perks.map((p) => (
            <div key={p.title} className="flex flex-col items-center text-center gap-2">
              <p.icon size={22} className="text-luxora-gold" />
              <p className="text-sm font-semibold text-luxora-text">{p.title}</p>
              <p className="text-xs text-luxora-muted">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
