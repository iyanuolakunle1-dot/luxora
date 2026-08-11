import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChefHat, Leaf, ConciergeBell, Wine, PlayCircle, UtensilsCrossed,
  Calendar, Clock, Users, Sparkles, CheckCircle2, MapPin, X, ArrowRight
} from 'lucide-react';
import { PLACEHOLDER } from '../../utils/placeholderImages';
import { getDiningImageUrl } from '../../utils/imageHelper';
import api from '../../lib/api';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import { notify } from '../../lib/toast';

const perks = [
  { icon: ChefHat, title: 'Michelin-Trained Chefs', desc: 'Crafting bespoke dishes with culinary passion and precision.' },
  { icon: Leaf, title: 'Artisanal Fresh Ingredients', desc: 'Sourced daily from top local organic farms and international markets.' },
  { icon: ConciergeBell, title: 'White-Glove Service', desc: 'Impeccable dining hospitality and dedicated table attendants.' },
  { icon: Wine, title: 'Curated Sommelier Cellar', desc: 'Over 200 fine vintage wines and signature handcrafted cocktails.' },
];

const diningVenues = [
  {
    name: 'The Golden Leaf Fine Dining',
    tag: 'Signature Restaurant',
    desc: 'Contemporary fine dining featuring multi-course tasting menus, premium steak cuts, and fresh ocean seafood.',
    hours: 'Breakfast: 6:30 AM – 10:30 AM | Dinner: 6:00 PM – 11:00 PM',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Skyline Rooftop Bar & Lounge',
    tag: 'Rooftop & Cocktails',
    desc: 'Panoramic skyline vistas paired with mixologist cocktails, tapas, ambient DJ beats, and sunset golden hour.',
    hours: 'Daily: 4:00 PM – 1:00 AM',
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function Dining() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDish, setSelectedDish] = useState(null);
  const [reservationModal, setReservationModal] = useState(false);
  const [reservedConfirmation, setReservedConfirmation] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [resForm, setResForm] = useState({
    venue: 'The Golden Leaf Fine Dining',
    date: new Date().toISOString().slice(0, 10),
    time: '19:30',
    guests: '2',
    full_name: '',
    email: '',
    phone: '',
    special_requests: '',
  });

  useEffect(() => {
    api.get('/menu-items', { params: { limit: 100 } })
      .then(({ data }) => setItems(data?.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...Array.from(new Set(items.map((i) => i.category).filter(Boolean)))];

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter((i) => i.category === selectedCategory);

  async function handleTableReservation(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const code = `#TBL-${Math.floor(Math.random() * 9000 + 1000)}`;
      // Simulated table reservation submission
      await new Promise((resolve) => setTimeout(resolve, 600));
      setReservedConfirmation({
        code,
        ...resForm,
      });
      notify.success('Table reserved successfully!');
    } catch {
      notify.error('Failed to reserve table. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="pt-20">
      {/* HERO SECTION */}
      <section className="relative h-[65vh] min-h-[480px] flex items-center">
        <img src={PLACEHOLDER.heroDining} className="absolute inset-0 w-full h-full object-cover" alt="Dining" />
        <div className="absolute inset-0 bg-gradient-to-r from-luxora-bg via-luxora-bg/75 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-5 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-luxora-gold text-xs font-semibold tracking-[0.25em] mb-3 uppercase">CULINARY EXCELLENCE</p>
            <h1 className="font-display text-4xl sm:text-6xl text-white mb-4 max-w-2xl leading-tight">
              An Unforgettable <span className="text-luxora-gold">Gastronomic</span> Journey
            </h1>
            <p className="text-luxora-muted max-w-lg mb-8 text-sm sm:text-base leading-relaxed">
              Savor culinary masterpieces prepared by world-renowned chefs. From intimate candlelit dinners to vibrant rooftop lounges, experience luxury at every bite.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => setReservationModal(true)} className="btn-primary !py-3 !px-7 rounded-full shadow-lg shadow-luxora-gold/20">
                Reserve a Table <ArrowRight size={16} />
              </button>
              <a href="#menu" className="btn-outline !py-3 !px-7 rounded-full">
                Explore Menu
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* DINING VENUES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-5 py-16">
        <div className="text-center mb-12">
          <p className="text-luxora-gold text-xs font-semibold tracking-[0.2em] mb-2 uppercase">OUR VENUES</p>
          <h2 className="font-display text-3xl sm:text-4xl text-white">Distinctive Dining Atmospheres</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {diningVenues.map((v, i) => (
            <motion.div
              key={v.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="card overflow-hidden group border-luxora-border hover:border-luxora-gold/40 transition-all duration-300"
            >
              <div className="h-64 overflow-hidden relative">
                <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-luxora-card via-transparent to-transparent" />
                <span className="absolute top-4 left-4 badge bg-luxora-gold text-luxora-bg font-semibold text-xs">{v.tag}</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-luxora-text mb-2">{v.name}</h3>
                <p className="text-sm text-luxora-muted mb-4 leading-relaxed">{v.desc}</p>
                <div className="flex items-center justify-between pt-4 border-t border-luxora-border text-xs text-luxora-muted">
                  <span className="flex items-center gap-1.5"><Clock size={14} className="text-luxora-gold" /> {v.hours}</span>
                  <button onClick={() => { setResForm((f) => ({ ...f, venue: v.name })); setReservationModal(true); }} className="text-luxora-gold font-semibold hover:underline">
                    Book Table →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE MENU SECTION */}
      <section id="menu" className="max-w-7xl mx-auto px-5 py-16 border-t border-luxora-border">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-luxora-gold text-xs font-semibold tracking-[0.2em] mb-2 uppercase">ARTISANAL MENU</p>
            <h2 className="font-display text-3xl sm:text-4xl text-white">Signature Dishes & Beverages</h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-luxora-gold text-luxora-bg font-semibold shadow-md shadow-luxora-gold/20'
                    : 'bg-white/5 text-luxora-muted hover:bg-white/10 hover:text-white border border-luxora-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)}
          </div>
        ) : filteredItems.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedDish(item)}
                className="card overflow-hidden group cursor-pointer hover:border-luxora-gold/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 overflow-hidden bg-white/5 relative">
                    <img
                      src={getDiningImageUrl(item.image_url, item.name)}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <span className="absolute bottom-2 left-2 badge bg-black/70 backdrop-blur-md text-white text-[10px] uppercase">
                      {item.category || 'Specialty'}
                    </span>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-luxora-text text-base group-hover:text-luxora-gold transition-colors line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-luxora-muted mt-1 line-clamp-2">
                      Exquisitely seasoned and prepared using organic artisanal ingredients by our master culinary team.
                    </p>
                  </div>
                </div>
                <div className="p-4 pt-0 flex items-center justify-between border-t border-luxora-border/50 mt-2">
                  <span className="text-luxora-gold font-bold text-base">₦{Number(item.price).toLocaleString()}</span>
                  <span className="text-xs text-luxora-muted group-hover:text-white transition-colors">Details →</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={UtensilsCrossed}
            title="No dishes found in this category"
            message="Try switching to another category or explore all available dishes."
          />
        )}
      </section>

      {/* PILLARS / PERKS */}
      <section className="border-t border-luxora-border bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-5 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {perks.map((p) => (
            <div key={p.title} className="flex flex-col items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-luxora-border">
              <div className="w-10 h-10 rounded-xl bg-luxora-gold/15 flex items-center justify-center text-luxora-gold shrink-0">
                <p.icon size={20} />
              </div>
              <p className="text-base font-semibold text-luxora-text">{p.title}</p>
              <p className="text-xs text-luxora-muted leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DISH DETAILS MODAL */}
      <Modal open={!!selectedDish} onClose={() => setSelectedDish(null)} title={selectedDish?.name || 'Dish Details'} size="md"
        footer={
          <>
            <button className="btn-outline" onClick={() => setSelectedDish(null)}>Close</button>
            <button className="btn-primary" onClick={() => { setSelectedDish(null); setReservationModal(true); }}>
              Reserve Table to Order
            </button>
          </>
        }>
        {selectedDish && (
          <div className="space-y-4">
            <div className="h-52 rounded-xl overflow-hidden bg-white/5 border border-luxora-border">
              <img src={getDiningImageUrl(selectedDish.image_url, selectedDish.name)} alt={selectedDish.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="badge bg-luxora-gold/20 text-luxora-gold text-xs">{selectedDish.category || 'Culinary Creation'}</span>
              <h3 className="text-xl font-bold text-luxora-text mt-2">{selectedDish.name}</h3>
              <p className="text-luxora-gold font-bold text-xl mt-1">₦{Number(selectedDish.price).toLocaleString()}</p>
            </div>
            <p className="text-sm text-luxora-muted leading-relaxed">
              Meticulously crafted by our culinary artisans using premium ingredients, paired with fresh garden herbs and exquisite spices.
            </p>
            <div className="p-3 bg-white/5 border border-luxora-border rounded-xl text-xs space-y-1 text-luxora-muted">
              <p className="flex items-center gap-1"><Sparkles size={13} className="text-luxora-gold" /> Chef's Signature Recommendation</p>
              <p className="flex items-center gap-1"><Leaf size={13} className="text-emerald-400" /> Gluten-Free / Halal Options Available on Request</p>
            </div>
          </div>
        )}
      </Modal>

      {/* TABLE RESERVATION MODAL */}
      <Modal open={reservationModal} onClose={() => { setReservationModal(false); setReservedConfirmation(null); }} title="Reserve a Dining Table" size="lg"
        footer={
          reservedConfirmation ? (
            <button className="btn-primary w-full justify-center" onClick={() => { setReservationModal(false); setReservedConfirmation(null); }}>
              Done
            </button>
          ) : (
            <>
              <button className="btn-outline" onClick={() => setReservationModal(false)}>Cancel</button>
              <button className="btn-primary" form="table-res-form" type="submit" disabled={submitting}>
                {submitting ? 'Confirming Reservation…' : 'Confirm Table Booking'}
              </button>
            </>
          )
        }>
        {reservedConfirmation ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-2xl font-bold text-luxora-text">Table Reserved!</h3>
            <p className="text-sm text-luxora-muted max-w-md mx-auto">
              We look forward to hosting you at <strong className="text-white">{reservedConfirmation.venue}</strong>. A confirmation has been logged for your arrival.
            </p>
            <div className="p-4 bg-white/5 border border-luxora-border rounded-2xl max-w-sm mx-auto text-xs space-y-2 text-left">
              <div className="flex justify-between"><span className="text-luxora-muted">Booking Reference:</span><span className="text-luxora-gold font-mono font-bold">{reservedConfirmation.code}</span></div>
              <div className="flex justify-between"><span className="text-luxora-muted">Date & Time:</span><span className="text-white font-medium">{reservedConfirmation.date} at {reservedConfirmation.time}</span></div>
              <div className="flex justify-between"><span className="text-luxora-muted">Party Size:</span><span className="text-white font-medium">{reservedConfirmation.guests} Guests</span></div>
              <div className="flex justify-between"><span className="text-luxora-muted">Guest:</span><span className="text-white font-medium">{reservedConfirmation.full_name || 'Valued Guest'}</span></div>
            </div>
          </div>
        ) : (
          <form id="table-res-form" onSubmit={handleTableReservation} className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Dining Venue</label>
                <select className="input" value={resForm.venue} onChange={(e) => setResForm({ ...resForm, venue: e.target.value })}>
                  <option>The Golden Leaf Fine Dining</option>
                  <option>Skyline Rooftop Bar & Lounge</option>
                  <option>Poolside Cabana Terrace</option>
                </select>
              </div>
              <div>
                <label className="label">Party Size</label>
                <select className="input" value={resForm.guests} onChange={(e) => setResForm({ ...resForm, guests: e.target.value })}>
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests (Table for 2)</option>
                  <option value="4">4 Guests (Family Table)</option>
                  <option value="6">6 Guests (Executive Booth)</option>
                  <option value="8">8+ Guests (Private Dining Hall)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Reservation Date</label>
                <input type="date" required className="input" value={resForm.date} onChange={(e) => setResForm({ ...resForm, date: e.target.value })} />
              </div>
              <div>
                <label className="label">Preferred Time</label>
                <select className="input" value={resForm.time} onChange={(e) => setResForm({ ...resForm, time: e.target.value })}>
                  <option value="12:30">12:30 PM (Lunch)</option>
                  <option value="14:00">02:00 PM (Afternoon)</option>
                  <option value="18:30">06:30 PM (Early Dinner)</option>
                  <option value="19:30">07:30 PM (Prime Dinner)</option>
                  <option value="21:00">09:00 PM (Late Night Drinks & Tapas)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label">Your Name</label>
                <input required className="input" placeholder="Full name" value={resForm.full_name} onChange={(e) => setResForm({ ...resForm, full_name: e.target.value })} />
              </div>
              <div>
                <label className="label">Email Address</label>
                <input required type="email" className="input" placeholder="you@example.com" value={resForm.email} onChange={(e) => setResForm({ ...resForm, email: e.target.value })} />
              </div>
              <div>
                <label className="label">Phone Number</label>
                <input required className="input" placeholder="+234..." value={resForm.phone} onChange={(e) => setResForm({ ...resForm, phone: e.target.value })} />
              </div>
            </div>

            <div>
              <label className="label">Special Requests / Dietary Notes (Optional)</label>
              <textarea rows={2} className="input" placeholder="Anniversary table, window seat, allergy requirements..." value={resForm.special_requests} onChange={(e) => setResForm({ ...resForm, special_requests: e.target.value })} />
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

