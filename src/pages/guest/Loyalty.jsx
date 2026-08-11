import { Star, Crown, Gift, TrendingUp } from 'lucide-react';
import { useGuestAuth } from '../../context/GuestAuthContext';

const tiers = [
  { name: 'Bronze', min: 0 }, { name: 'Silver', min: 1000 }, { name: 'Gold', min: 2500 }, { name: 'Platinum', min: 5000 },
];

export default function GuestLoyalty() {
  const { guest } = useGuestAuth();
  const points = guest?.loyalty_points ?? 0;
  const currentTierIndex = tiers.reduce((idx, t, i) => (points >= t.min ? i : idx), 0);
  const nextTier = tiers[currentTierIndex + 1];
  const progress = nextTier ? Math.min(100, Math.round(((points - tiers[currentTierIndex].min) / (nextTier.min - tiers[currentTierIndex].min)) * 100)) : 100;

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-luxora-text">Loyalty Points</h1><p className="text-sm text-luxora-muted mt-1">Track your Luxora Rewards status and points balance.</p></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="card p-6 lg:col-span-2 bg-gradient-to-br from-luxora-gold/15 to-transparent">
          <div className="flex items-center gap-2 text-luxora-gold text-sm font-semibold mb-2"><Crown size={16} /> {guest?.membership_tier || 'Bronze'} MEMBER</div>
          <p className="text-4xl font-bold text-luxora-text mb-1">{points.toLocaleString()} <span className="text-base font-normal text-luxora-muted">points</span></p>
          {nextTier ? (
            <>
              <p className="text-xs text-luxora-muted mb-3">{nextTier.min - points} points to {nextTier.name} tier</p>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-luxora-gold rounded-full" style={{ width: `${progress}%` }} /></div>
            </>
          ) : <p className="text-xs text-luxora-muted">You've reached our highest tier!</p>}
        </div>
        <div className="card p-6 flex flex-col justify-center items-center text-center">
          <TrendingUp size={22} className="text-emerald-400 mb-2" />
          <p className="text-2xl font-bold text-luxora-text">1 point</p>
          <p className="text-xs text-luxora-muted">per ₦1,000 spent</p>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-luxora-text mb-4 flex items-center gap-2"><Gift size={16} className="text-luxora-gold" /> Membership Tiers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {tiers.map((t, i) => (
            <div key={t.name} className={`rounded-xl p-4 border ${i === currentTierIndex ? 'border-luxora-gold bg-luxora-gold/10' : 'border-luxora-border'}`}>
              <Star size={16} className={i === currentTierIndex ? 'text-luxora-gold' : 'text-luxora-muted'} />
              <p className="font-semibold text-luxora-text mt-2">{t.name}</p>
              <p className="text-xs text-luxora-muted">{t.min.toLocaleString()}+ points</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
