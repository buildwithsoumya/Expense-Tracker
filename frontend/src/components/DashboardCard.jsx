const DashboardCard = ({ title, value, subtitle, icon, className = '' }) => (
  <div className={`glass-card flex items-center justify-between gap-4 p-5 ${className}`}>
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-silver-muted">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-silver">{value}</p>
      {subtitle && <p className="mt-2 text-xs text-silver-muted">{subtitle}</p>}
    </div>
    <div className="flex h-12 w-12 items-center justify-center border border-glass-border bg-graphite/70 text-silver-muted">
      {icon}
    </div>
  </div>
)

export default DashboardCard
