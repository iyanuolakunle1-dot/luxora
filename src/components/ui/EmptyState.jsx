export default function EmptyState({ icon: Icon, title = 'Nothing here yet', message, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      {Icon && <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-luxora-muted mb-4"><Icon size={26} /></div>}
      <h3 className="text-luxora-text font-semibold">{title}</h3>
      {message && <p className="text-sm text-luxora-muted mt-1 max-w-sm">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
