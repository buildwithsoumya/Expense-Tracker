const DashboardCard = ({ title, value, subtitle, icon }) => (
  <div className="glass-card glass-highlight flex items-center justify-between gap-4 p-5">
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-silver-muted">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-silver">{value}</p>
      {subtitle && <p className="mt-2 text-xs text-silver-muted">{subtitle}</p>}
    </div>
    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-glass-border bg-charcoal/70 text-electric-blue">
      {icon}
    </div>
  </div>
)

export default DashboardCard
