import { motion } from 'framer-motion';
import { Award, Users, Building2, MapPin, Medal, HeartHandshake, Sparkles, ShieldCheck } from 'lucide-react';
import { PLACEHOLDER } from '../../utils/placeholderImages';

const stats = [
  { icon: Award, value: '15+', label: 'Years of Excellence' },
  { icon: Users, value: '50K+', label: 'Happy Guests' },
  { icon: Building2, value: '200+', label: 'Luxury Rooms' },
  { icon: MapPin, value: '12', label: 'Destinations' },
];

const promises = [
  { icon: Medal, title: 'Uncompromised Quality', desc: 'We maintain the highest standards in every aspect of your stay.' },
  { icon: HeartHandshake, title: 'Personalized Service', desc: 'Our dedicated team is here to make every moment special for you.' },
  { icon: Sparkles, title: 'Luxurious Experiences', desc: 'Indulge in curated experiences that delight and inspire.' },
  { icon: ShieldCheck, title: 'Trust & Transparency', desc: 'Your comfort, safety, and satisfaction are our top priorities.' },
];

export default function About() {
  return (
    <div className="pt-20">
      <section className="relative h-[52vh] min-h-[380px] flex items-end">
        <img src={PLACEHOLDER.heroAbout} className="absolute inset-0 w-full h-full object-cover" alt="About Luxora" />
        <div className="absolute inset-0 bg-gradient-to-t from-luxora-bg via-luxora-bg/60 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-5 pb-14 w-full">
          <p className="text-luxora-gold text-xs font-semibold tracking-[0.2em] mb-3">ABOUT LUXORA</p>
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-3">Crafted for Comfort. <span className="text-luxora-gold">Inspired by You.</span></h1>
          <p className="text-luxora-muted max-w-lg">At Luxora Hotels & Resorts, we believe every stay should be a collection of unforgettable moments, personalized service, and true luxury.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 py-14 grid grid-cols-2 sm:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <s.icon className="text-luxora-gold mx-auto mb-2" size={26} />
            <p className="font-display text-3xl text-white">{s.value}</p>
            <p className="text-xs text-luxora-muted mt-1">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="max-w-7xl mx-auto px-5 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="grid grid-cols-2 gap-4">
          <img src={PLACEHOLDER.lobby} className="rounded-2xl h-72 w-full object-cover col-span-2" alt="" />
          <img src={PLACEHOLDER.concierge} className="rounded-2xl h-40 w-full object-cover" alt="" />
          <img src={PLACEHOLDER.spaTreatment} className="rounded-2xl h-40 w-full object-cover" alt="" />
        </div>
        <div>
          <p className="text-luxora-gold text-xs font-semibold tracking-[0.2em] mb-3">OUR STORY</p>
          <h2 className="font-display text-3xl text-white mb-4">A Legacy of Hospitality and Excellence</h2>
          <p className="text-luxora-muted text-sm leading-relaxed mb-4">Founded with a passion for timeless elegance and personalized service, Luxora Hotels & Resorts has grown into a collection of iconic destinations that redefine luxury hospitality.</p>
          <p className="text-luxora-muted text-sm leading-relaxed mb-6">From world-class amenities to exquisite dining and unforgettable experiences, every detail is thoughtfully curated to make your stay extraordinary.</p>
          <button className="btn-outline rounded-full">Our Journey</button>
        </div>
      </section>

      <section className="bg-luxora-surface py-16">
        <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {promises.map((p) => (
            <motion.div key={p.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card p-6">
              <p.icon className="text-luxora-gold mb-3" size={22} />
              <h3 className="font-semibold text-luxora-text mb-1.5">{p.title}</h3>
              <p className="text-sm text-luxora-muted">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-5 py-20 text-center">
        <p className="font-display text-2xl sm:text-3xl text-white leading-relaxed">"At Luxora, we don't just offer a place to stay, we offer a place to belong."</p>
        <p className="text-luxora-gold text-sm mt-4 italic">— The Luxora Team</p>
      </section>
    </div>
  );
}
