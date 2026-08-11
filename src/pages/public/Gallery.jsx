import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, X, Image as ImageIcon } from 'lucide-react';
import { PLACEHOLDER } from '../../utils/placeholderImages';
import api from '../../lib/api';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    api.get('/gallery', { params: { limit: 100 } })
      .then(({ data }) => setImages(data?.data || []))
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(images.map((i) => i.category).filter(Boolean))];
  const filtered = active === 'All' ? images : images.filter((i) => i.category === active);

  return (
    <div className="pt-20">
      <section className="relative h-[52vh] min-h-[380px] flex items-end">
        <img src={PLACEHOLDER.heroGallery} className="absolute inset-0 w-full h-full object-cover" alt="Gallery" />
        <div className="absolute inset-0 bg-gradient-to-t from-luxora-bg via-luxora-bg/60 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-5 pb-14 w-full">
          <p className="text-luxora-gold text-xs font-semibold tracking-[0.2em] mb-3">OUR GALLERY</p>
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-3">Moments of Luxury, Captured Beautifully</h1>
          <p className="text-luxora-muted max-w-lg flex items-center gap-2"><Camera size={15} className="text-luxora-gold" /> Every image tells a story</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 py-14">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-[4/3] w-full rounded-xl" />)}
          </div>
        ) : images.length ? (
          <>
            <div className="flex gap-3 overflow-x-auto pb-2 mb-8">
              {categories.map((c) => (
                <button key={c} onClick={() => setActive(c)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${active === c ? 'bg-luxora-gold text-luxora-bg border-luxora-gold' : 'border-luxora-border text-luxora-muted hover:border-luxora-gold hover:text-luxora-gold'}`}>{c}</button>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((img, i) => (
                <motion.button key={img.id} onClick={() => setLightbox(img.image_url)} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: (i % 8) * 0.05 }}
                  className="relative rounded-xl overflow-hidden aspect-[4/3] group bg-white/5">
                  <img src={img.image_url} alt={img.caption || ''} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                </motion.button>
              ))}
            </div>
          </>
        ) : (
          <EmptyState icon={ImageIcon} title="No photos published yet"
            message="Upload property photos from the admin dashboard (Website Management → Gallery) and they'll appear here immediately." />
        )}
      </section>

      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6" onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 text-white"><X size={28} /></button>
          <motion.img initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} src={lightbox} alt="" className="max-h-[85vh] max-w-full rounded-xl" />
        </div>
      )}
    </div>
  );
}
