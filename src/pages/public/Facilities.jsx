import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Star, Headphones, Wifi, Sparkles } from 'lucide-react';
import { PLACEHOLDER } from '../../utils/placeholderImages';
import { getFacilityImageUrl } from '../../utils/imageHelper';
import api from '../../lib/api';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';

const perks = [
  { icon: ShieldCheck, title: 'Best Rate Guarantee', desc: 'We ensure you get the best price every time you book.' },
  { icon: Star, title: 'Exclusive Offers', desc: 'Enjoy special deals and seasonal promotions.' },
  { icon: Headphones, title: 'Dedicated Concierge', desc: 'Our concierge team is always ready to assist you.' },
  { icon: Wifi, title: 'Free Wi-Fi', desc: 'Stay connected with our high-speed internet access.' },
];

export default function Facilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/facilities', { params: { limit: 50, status: 'active' } })
      .then(({ data }) => setFacilities(data?.data || []))
      .catch(() => setFacilities([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-20">
      <section className="relative h-[52vh] min-h-[380px] flex items-end">
        <img src={PLACEHOLDER.heroFacilities} className="absolute inset-0 w-full h-full object-cover" alt="Facilities" />
        <div className="absolute inset-0 bg-gradient-to-t from-luxora-bg via-luxora-bg/60 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-5 pb-14 w-full">
          <p className="text-luxora-gold text-xs font-semibold tracking-[0.2em] mb-3">PREMIUM FACILITIES</p>
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-3">Designed for Your Comfort</h1>
          <p className="text-luxora-muted max-w-lg">At Luxora, we provide world-class facilities and personalized services to ensure a comfortable, relaxing and unforgettable stay.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 py-16">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)}
          </div>
        ) : facilities.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((f, i) => (
              <motion.div key={f.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.08, duration: 0.4 }}
                className="card overflow-hidden group">
                <div className="h-44 overflow-hidden bg-white/5">
                  <img src={getFacilityImageUrl(f.image_url, f.name, f.category)} alt={f.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-luxora-text mb-1.5">{f.name}</h3>
                  <p className="text-sm text-luxora-muted">{f.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState icon={Sparkles} title="No facilities published yet"
            message="Facilities added from the admin dashboard (Facilities → Add New Facility, status set to Active) will automatically appear here." />
        )}
      </section>

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
