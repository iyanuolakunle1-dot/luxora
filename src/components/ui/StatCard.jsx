import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, iconColor = 'text-luxora-gold', iconBg = 'bg-luxora-gold/15', label, value, delta, deltaLabel = 'vs last week', deltaPositive = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card p-5 flex items-start gap-4 hover:border-luxora-gold/40 transition-colors"
    >
      {Icon && (
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}>
          <Icon size={20} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs text-luxora-muted font-medium">{label}</p>
        <p className="text-2xl font-bold text-luxora-text mt-0.5 truncate">{value}</p>
        {delta && (
          <p className={`text-xs mt-1 font-medium ${deltaPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {deltaPositive ? '↑' : '↓'} {delta} <span className="text-luxora-muted font-normal">{deltaLabel}</span>
          </p>
        )}
      </div>
    </motion.div>
  );
}
