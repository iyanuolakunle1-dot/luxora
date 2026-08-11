import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onChange, totalLabel }) {
  if (!totalPages || totalPages < 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 2), page + 1);

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 px-1 py-4">
      <p className="text-xs text-luxora-muted">{totalLabel}</p>
      <div className="flex items-center gap-1">
        <button className="btn-ghost !px-2" disabled={page === 1} onClick={() => onChange(1)}><ChevronsLeft size={16} /></button>
        <button className="btn-ghost !px-2" disabled={page === 1} onClick={() => onChange(page - 1)}><ChevronLeft size={16} /></button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-luxora-gold text-luxora-bg' : 'text-luxora-muted hover:bg-white/5'}`}
          >
            {p}
          </button>
        ))}
        <button className="btn-ghost !px-2" disabled={page === totalPages} onClick={() => onChange(page + 1)}><ChevronRight size={16} /></button>
        <button className="btn-ghost !px-2" disabled={page === totalPages} onClick={() => onChange(totalPages)}><ChevronsRight size={16} /></button>
      </div>
    </div>
  );
}
