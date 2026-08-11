export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold text-luxora-text">{title}</h1>
        {subtitle && <p className="text-sm text-luxora-muted mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}
