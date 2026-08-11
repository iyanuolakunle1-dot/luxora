import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Crown, Calendar, Sparkles } from 'lucide-react';
import api from '../../lib/api';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import { getOfferImageUrl } from '../../utils/imageHelper';

export default function GuestOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState(null);

  useEffect(() => {
    api.get('/offers', { params: { limit: 50, status: 'active' } }).then(({ data }) => setOffers(data?.data || [])).catch(() => setOffers([])).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-luxora-text">Special Offers</h1><p className="text-sm text-luxora-muted mt-1">Discover amazing deals and save more on your next stay.</p></div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)}</div>
          ) : offers.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {offers.map((o, i) => (
                <div key={o.id} className="card overflow-hidden hover:border-luxora-gold/40 transition-colors">
                  <div className="h-40 bg-white/5"><img src={getOfferImageUrl(o.image_url, o.title, i)} className="w-full h-full object-cover" alt="" /></div>
                  <div className="p-4">
                    <div className="flex gap-2 mb-2">{o.category && <span className="badge bg-luxora-gold/15 text-luxora-gold">{o.category}</span>}</div>
                    <h3 className="font-semibold text-luxora-text mb-1">{o.title}</h3>
                    <p className="text-xs text-luxora-muted mb-3 line-clamp-2">{o.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-luxora-border">
                      <span className="text-luxora-gold font-semibold text-sm">{o.discount_percent ? `Up to ${o.discount_percent}% OFF` : o.fixed_price ? `₦${Number(o.fixed_price).toLocaleString()}` : 'Special'}</span>
                      <button className="btn-primary !py-1.5 !px-3 text-xs" onClick={() => setSelectedOffer(o)}>View Details</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Tag} title="No active offers right now" message="Check back soon — new member offers are added regularly." />
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-gradient-to-br from-luxora-purple/25 to-transparent border border-luxora-purple/30 p-5">
            <Crown size={20} className="text-luxora-purple mb-2" />
            <h3 className="font-semibold text-luxora-text mb-1">Exclusive Member Offers</h3>
            <p className="text-sm text-luxora-muted mb-4">Unlock exclusive deals and extra savings as a valued guest.</p>
            <Link to="/rooms" className="btn-primary !py-2 text-xs w-full justify-center">Book With Member Rate</Link>
          </div>
        </div>
      </div>

      {/* OFFER DETAILS MODAL */}
      <Modal open={!!selectedOffer} onClose={() => setSelectedOffer(null)} title={selectedOffer?.title || 'Offer Details'} size="md"
        footer={<>
          <button className="btn-outline" onClick={() => setSelectedOffer(null)}>Close</button>
          <Link to="/rooms" className="btn-primary" onClick={() => setSelectedOffer(null)}>Apply Offer & Book Room</Link>
        </>}>
        {selectedOffer && (
          <div className="space-y-4">
            <div className="h-44 rounded-xl overflow-hidden bg-white/5 border border-luxora-border">
              <img src={getOfferImageUrl(selectedOffer.image_url, selectedOffer.title)} alt={selectedOffer.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="badge bg-luxora-gold text-luxora-bg text-xs">{selectedOffer.category || 'Member Perk'}</span>
              <h3 className="text-xl font-bold text-luxora-text mt-2">{selectedOffer.title}</h3>
              <p className="text-luxora-gold font-bold text-lg mt-1">
                {selectedOffer.discount_percent ? `${selectedOffer.discount_percent}% Discount` : selectedOffer.fixed_price ? `Fixed Rate: ₦${Number(selectedOffer.fixed_price).toLocaleString()}` : 'Exclusive Offer'}
              </p>
            </div>
            <p className="text-sm text-luxora-muted leading-relaxed">{selectedOffer.description || 'Special promotional deal exclusively curated for your luxury stay experience.'}</p>
            <div className="p-3 bg-white/5 border border-luxora-border rounded-xl text-xs space-y-1.5 text-luxora-muted">
              {selectedOffer.valid_from && selectedOffer.valid_to && (
                <p className="flex items-center gap-1"><Calendar size={13} /> <strong className="text-luxora-text">Valid Until:</strong> {selectedOffer.valid_to}</p>
              )}
              <p className="flex items-center gap-1"><Sparkles size={13} /> <strong className="text-luxora-text">Offer Type:</strong> {selectedOffer.type?.replace('_', ' ').toUpperCase()}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
